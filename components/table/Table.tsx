import * as React from 'react';
import type { ITableInteraction, ITableProps, ITableState } from './types';
import { TableSectionType } from './types';
import { allPass, append, clone, eqProps, prepend } from 'ramda';
import { useStyles } from './useStyles';
import { TABLE_ROW_ACTION_BUTTON_POSITION } from '@/config';
import TableSection from './components/TableSection';
import { getDOMRectObserver } from './utilts';
import Form from '@/backoffice-common/components/form/Form';
import TableContextProvider from './TableContextProvider';

// react-table props below
// columnFilters: [],
// columnOrder: [],
// columnPinning: {  },
// columnSizing: {  },
// columnSizingInfo: {
//     columnSizingStart: [],
//     deltaOffset: null,
//     deltaPercentage: null,
//     isResizingColumn: false,
//     startOffset: null,
//     startSize: null
// },
// columnVisibility: {},
// expanded: {  },
// globalFilter: {  },
// grouping: [],
// pagination: {
//     pageIndex: 1,
//     pageSize: 1
// },
// rowSelection: {},
// sorting: []
import {
    CellContext,
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    TableState,
    useReactTable
} from '@tanstack/react-table'
import { IRowActionButton } from '@/backoffice-common/hooks/useListPage';
import { IFormValues } from '@/backoffice-common/components/form/helper';
import { initialState, reducer } from './reducer';
import { useBodyScrolls } from '@/backoffice-common/components/table/hooks';
import TablePagination from '@/backoffice-common/components/table/components/pagination/TablePagination';
import { useMyStore } from '@/backoffice-common/components/table/context';

// compare 2 objects' given props values.
const check = allPass([
    eqProps('page'),
    eqProps('pageSize'),
])

const TableComponent = ({
    onInteract,
    rowActionButtons,
    rowActionButtonPosition = TABLE_ROW_ACTION_BUTTON_POSITION,
    state: externalState
}: ITableProps) => {
    const { classes } = useStyles();
    const [ state, dispatch ] = React.useReducer(reducer, initialState);
    const { leftBodyRef, centerBodyRef, rightBodyRef } = useBodyScrolls();
    const tablesContainerRef = React.useRef<HTMLDivElement>(null);
    const z = useMyStore();

    // console.log('z>>>zZ>Z>Z>Z>Z>Z>ZZ>>>>>', z.count);

    React.useEffect(() => {
        // console.log('INCREMENT')
        z.inc()
    }, [])

    // console.log('CTXXXX>>>', context);

    React.useEffect(() => {
        if (tablesContainerRef.current) {
            const observer = getDOMRectObserver('height');
            for (const tableElement of tablesContainerRef.current.children) {
                //TODO: Remove class selector
                const headerElement = tableElement.querySelector('.thead');
                if (headerElement) {
                    observer.observe(headerElement);
                }
            }
        }
        // 1. Observe if column is added or removed
        // 2. Add resize observer to all column cells
    }, [])

    React.useEffect(() => {
        table.setColumnPinning({
            right: ['table-actions-column']
        })
    }, []);


    React.useLayoutEffect(() => {
        if (tablesContainerRef.current) {
            for (const section of tablesContainerRef.current.children) {
                // console.log('>>>', section);
            }
        }
    }, []);

    const tableColumns = React.useMemo(() => {
        let cols = clone(externalState.columns);
        if (rowActionButtons?.length) {
            const actionButtonsColumn: ColumnDef<Record<string, unknown>> = {
                header: '',
                id: 'table-actions-column',
                cell(props) {
                    return (
                        <div className={classes.actionButtons}>
                            {
                                rowActionButtons.map((actionButton, index) => renderActionButton(actionButton, index, props))
                            }
                        </div>
                    )
                },
                enablePinning: true,
                // size: 350
            }
            if (rowActionButtonPosition === 'right') {
                cols = append(
                    actionButtonsColumn,
                    externalState.columns
                );
            } else {
                cols = prepend(
                    actionButtonsColumn,
                    externalState.columns
                );
            }
        }

        const v = cols.map((column) => {
            const x = clone(column)
            let id = x.id;
            if ('accessorKey' in x) {
                id = x.accessorKey;
            }
            id = id?.replace('.', '_')
            // const z = context.columnInformation.find(item => item.key === id);
            // console.log('ZZZ>>>>', z);
            // if (z) {
            //     x.size = z.width;
            // }
            return x;
        })
        // console.log('dSADASDASDASDASDSADA>>>>', v);
        return v;
    }, [ externalState.columns, rowActionButtons ]);

    const table = useReactTable({
        data: externalState.docs,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: externalState.pageSize,
                pageIndex: externalState.page - 1,
            }
        },
        defaultColumn: {
            enableResizing: true,
            // minSize: 0,
            // size: Number.MAX_SAFE_INTEGER,
            // maxSize: Number.MAX_SAFE_INTEGER,
        },
        manualPagination: true,
        onStateChange: (updater) => {
            if (updater instanceof Function) {
                const newState = updater(table.getState());
                handleTableStateChange(newState);
            }
        },
        renderFallbackValue: '-',
        enablePinning: true,
        enableColumnResizing: true,
    })

    const handleTableStateChange = (updatedTableState: TableState) => {
        const updatedState: ITableState = {
            page: updatedTableState.pagination.pageIndex + 1,
            pageSize: updatedTableState.pagination.pageSize,
        }
        if (!check(externalState, updatedState)) {
            handleInteraction({ state: updatedState })
        }
    }

    const handleInteraction = (value: Partial<ITableInteraction>) => {
        const params: ITableInteraction = {
            state: {
                page: externalState.page,
                pageSize: externalState.pageSize,
                totalPage: externalState.totalPage,
            },
            filter: state.filter,
            ...value,
        }
        onInteract(params)
    }

    table.setOptions(prev => ({
        ...prev,
        // state,
        pageCount: externalState.totalPage,
        pagination: {
            pageSize: externalState.pageSize,
            pageIndex: externalState.page - 1
        },
        // debugTable: true,
    }));

    const renderActionButton = (actionButton: IRowActionButton, index: number, props: CellContext<any, any>) => {
        if (actionButton.visibility) {
            if ('hasValue' in actionButton.visibility) {
                if (!props.row.original[actionButton.visibility.key]) {
                    return null;
                }
            }
            if ('value' in actionButton.visibility) {
                if (props.row.original[actionButton.visibility.key] !== actionButton.visibility.value) {
                    return null;
                }
            }
            if ('valueNotEquals' in actionButton.visibility) {
                if (props.row.original[actionButton.visibility.key] === actionButton.visibility.valueNotEquals) {
                    return null;
                }
            }
        }
        if (typeof actionButton.label === 'function') {
            return (
                <div
                    key={`action-button-${index}`}
                    onClick={() => actionButton.onClick?.(props.row.original)}
                >
                    {actionButton.label(props.row.original)}
                </div>
            )
        }
        return (
            <div
                key={`action-button-${index}`}
                onClick={() => actionButton.onClick?.(props.row.original)}
            >
                {actionButton.label ?? null}
            </div>
        )
    }

    const handleFilterChange = (values: IFormValues) => {
        dispatch({
            type: 'HANDLE_FILTER_ITEM_CHANGE',
            payload: values
        })
        handleInteraction({
            filter: values,
            state: {
                page: 1,
                pageSize: externalState.pageSize,
                totalPage: externalState.totalPage
            }
        })
    }

    return (
        <TableContextProvider>
            <div className={classes.container}>
                <div>
                    {
                        externalState.filter && (
                            <Form
                                fields={externalState.filter ?? []}
                                submitButtonProps={{
                                    style: {
                                        display: 'none'
                                    }
                                }}
                                direction={'row'}
                                onSubmit={() => undefined}
                                onChange={handleFilterChange}
                            />
                        )
                    }
                </div>
                <div className={classes.tableWrapper}>
                    <div className={classes.table} ref={tablesContainerRef}>
                        <TableSection
                            section={TableSectionType.LEFT}
                            table={table}
                            bodyRef={leftBodyRef}
                        />
                        <TableSection
                            section={TableSectionType.CENTER}
                            table={table}
                            bodyRef={centerBodyRef}
                        />
                        <TableSection
                            section={TableSectionType.RIGHT}
                            table={table}
                            bodyRef={rightBodyRef}
                        />
                    </div>
                </div>
                <TablePagination
                    canPreviousPage={table.getCanPreviousPage()}
                    canNextPage={table.getCanNextPage()}
                    pageSize={externalState.pageSize.toString()}
                    pageCount={table.getPageCount()}
                    page={externalState.page}
                    onPageSizeChange={value =>  table.setPageSize(value)}
                    onPageIndexChange={value => table.setPageIndex(value)}
                    onPreviousPage={table.previousPage}
                    onNextPage={table.nextPage}
                />
            </div>
        </TableContextProvider>
    )
}

export default TableComponent;