import * as React from 'react';
import type { ITableInteraction, ITableProps, ITableState } from './types';
import { append, assocPath, clone, path, prepend, eqProps, allPass } from 'ramda';
import { useStyles } from './useStyles';
import { IFieldRenderType } from '@/backoffice-common/types/api';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import { TABLE_ROW_ACTION_BUTTON_POSITION } from '@/config';
import TableFilter from './filter';
import TableElement from '@/backoffice-common/components/table/components/TableElement';

import Form from '@/backoffice-common/components/form/Form';

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
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    TableState,
    useReactTable,
    CellContext
} from '@tanstack/react-table'
import { IRowActionButton } from '@/backoffice-common/hooks/useListPage';
import { IFormValues } from '@/backoffice-common/components/form/helper';
import { reducer, initialState } from './reducer';
import { useBodyScrolls } from '@/backoffice-common/components/table/hooks';
import TablePagination from '@/backoffice-common/components/table/components/pagination/TablePagination';
const Table = ({
    onInteract,
    rowActionButtons,
    rowActionButtonPosition = TABLE_ROW_ACTION_BUTTON_POSITION,
    state: externalState
}: ITableProps) => {
    const { classes } = useStyles();
    const [ state, dispatch ] = React.useReducer(reducer, initialState);
    const { leftBodyRef, centerBodyRef, rightBodyRef } = useBodyScrolls();
    const tablesContainerRef = React.useRef<HTMLDivElement>(null);

    const tableColumns = React.useMemo(() => {
        let cols = clone(externalState.columns);
        if (rowActionButtons?.length) {
            const actionButtonsColumn: ColumnDef<Record<string, any>> = {
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
                enablePinning: true
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
        return cols;
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
        enablePinning: true
    })

    React.useEffect(() => {
        table.setColumnPinning({
            right: ['table-actions-column']
        })
    }, []);

    // compare 2 objects' given props values.
    const check = allPass([
        eqProps('page'),
        eqProps('pageSize'),
    ])

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
        debugTable: true,
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

    const handleRowHeightChange = () => {
        if (tablesContainerRef.current) {
            Array.from(tablesContainerRef.current.children).forEach(element => {
                // @ts-ignore
                [...element.querySelector('.tbody').children, ...element.querySelector('.thead').children].forEach((rowElement) => {
                    const id = rowElement.id;
                    // remove last -right -left -center
                    let prefix = '';
                    if (id.endsWith('-right')) {
                        prefix = id.substring(0, id.length - '-right'.length);
                    } else if (id.endsWith('-center')) {
                        prefix = id.substring(0, id.length - '-center'.length);
                    } else if (id.endsWith('-left')) {
                        prefix = id.substring(0, id.length - '-left'.length);
                    }
                    if (tablesContainerRef.current && prefix) {
                        const rows = Array.from(tablesContainerRef.current.querySelectorAll(`[id^=${prefix}]`));
                        let highest = 0;
                        for (const el of rows) {
                            const h = el.getBoundingClientRect().height;
                            if (h > highest) {
                                highest = h;
                            }
                        }
                        for (const el of rows) {
                            if (highest) {
                                // @ts-ignore
                                el.style.height = highest + 'px';
                            }
                        }
                    }
                })
            })
        }
    }

    return (
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
                <div style={{ border: '0px solid teal', minWidth: '100%', display: 'flex', maxHeight: '100%' }} ref={tablesContainerRef}>
                    <TableElement
                        type='left'
                        table={table}
                        bodyRef={leftBodyRef}
                        onResize={handleRowHeightChange}
                        // style={{
                        //     border: '1px solid blue'
                        // }}
                    />
                    <TableElement
                        type='center'
                        table={table}
                        bodyRef={centerBodyRef}
                        onResize={handleRowHeightChange}
                        style={{
                            flex: 1
                        //     border: '1px solid green'
                        }}
                    />
                    <TableElement
                        type='right'
                        table={table}
                        bodyRef={rightBodyRef}
                        style={{
                            // width: 200,
                            // border: '1px solid pink'
                        }}
                        onResize={handleRowHeightChange}
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
    )
}

export default Table;