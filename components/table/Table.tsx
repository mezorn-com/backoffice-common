import * as React from 'react';
import type { ITableInteraction, ITableProps, ITableState } from './types';
import { TableSectionType } from './types';
import { useStyles } from './useStyles';
import { TABLE_ROW_ACTION_BUTTON_POSITION } from '@/config';
import TableSection from './components/TableSection';
import { getCellObserver } from './utils';
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
import { isRenderField } from '@/backoffice-common/utils';
import { usePathParameter, useRenderField } from '@/backoffice-common/hooks';

import { TableContext } from '@/backoffice-common/components/table/context';
import { allPass, append, clone, eqProps, prepend, equals } from 'ramda';
import { ActionIcon, Button, Menu } from '@mantine/core';
import BulkActionDrawer from '@/backoffice-common/components/table/components/BulkActionDrawer';
import axios from 'axios';
import { IResponse } from '@/backoffice-common/types/api';
import { IconAdjustments, IconDots } from '@tabler/icons-react';
import { replacePathParameters } from '@/backoffice-common/utils';


// compare 2 objects' given props values.
const check = allPass([
    eqProps('page'),
    eqProps('pageSize'),
])

const eqValues = (a1: unknown[], a2: unknown[]) => equals(new Set(a1), new Set(a2))

const Table = ({
    onInteract,
    rowActionButtons,
    rowActionButtonPosition = TABLE_ROW_ACTION_BUTTON_POSITION,
    state: externalState,
    pageSizes = [10, 20, 50],
    dispatch: dispatchExternalState
}: ITableProps) => {
    const { classes } = useStyles();
    const [ state, dispatch ] = React.useReducer(reducer, initialState);
    const tablesContainerRef = React.useRef<HTMLDivElement>(null);
    const columnObserverRef = React.useRef<ResizeObserver | null>(null);

    const pathParameter = usePathParameter();
    const { leftBodyRef, centerBodyRef, rightBodyRef } = useBodyScrolls();
    const renderField = useRenderField();

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
            enableResizing: true,
            cell(props) {
                const { meta } = props.column.columnDef;
                if (!meta) {
                    return props.renderValue();
                }
                if (isRenderField(meta.field)) {
                    return renderField(meta.field, props.getValue(), props.row.original)
                }
                return props.renderValue();
            }
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
        enableRowSelection: true,
    });

    React.useEffect(() => {
        columnObserverRef.current = getCellObserver();
        table.setColumnPinning({
            right: ['table-actions-column']
        })
    }, []);

    React.useEffect(() => {
        const ids = table.getSelectedRowModel().rows.map(row => row.original._id) as string[];
        if (!eqValues(ids, externalState.selectedRows)) {
            dispatchExternalState?.({
                type: 'HANDLE_ROW_SELECT_CHANGE',
                payload: ids,
            })
        }
    }, [table.getSelectedRowModel().rows]);

    React.useEffect(() => {
        table.setOptions(prev => ({
            ...prev,
            pageCount: externalState.totalPage,
            pagination: {
                pageSize: externalState.pageSize,
                pageIndex: externalState.page - 1
            },
        }));
    }, [externalState]);

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

    const renderBulkActions = () => {
        if (!externalState.bulkItemActions  || !externalState.selectedRows?.length) {
            return null;
        }
        return (
            <>
                <BulkActionDrawer
                    onClose={() => {
                        dispatch({
                            type: 'UPDATE_BULK_ACTION',
                            payload: undefined,
                        })
                    }}
                    bulkAction={state.selectedBulkAction}
                    onSubmit={async (values) => {
                        const response = await axios<IResponse<unknown>>({
                            url: replacePathParameters(state?.selectedBulkAction?.api?.uri ?? '', pathParameter),
                            method: state?.selectedBulkAction?.api?.method,
                            data: {
                                ...values,
                                ids: externalState.selectedRows
                            }
                        })
                        if (response.data.success) {
                            dispatch({
                                type: 'UPDATE_BULK_ACTION',
                                payload: undefined,
                            })
                            dispatchExternalState?.({
                                type: 'HANDLE_ROW_SELECT_CHANGE',
                                payload: []
                            })
                        }
                    }}
                />
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Button
                            leftIcon={<IconAdjustments size={18}/>}
                            rightIcon={<IconDots size={18}/>}
                            size='xs'
                            color={'yellow'}
                        />
                    </Menu.Target>

                    <Menu.Dropdown>
                        {
                            Object.keys(externalState.bulkItemActions).map(key => {
                                const bulkAction = externalState.bulkItemActions?.[key];
                                if (!bulkAction) {
                                    return null;
                                }
                                return (
                                    <Menu.Item
                                        key={key}
                                        onClick={() => {
                                            dispatch({
                                                type: 'UPDATE_BULK_ACTION',
                                                payload: bulkAction,
                                            })
                                        }}
                                    >
                                        {bulkAction.label}
                                    </Menu.Item>
                                )
                            })
                        }
                    </Menu.Dropdown>
                </Menu>
            </>
        )
    }

    return (
        <TableContext.Provider value={{ columnObserver: columnObserverRef.current }}>
            <div className={classes.container}>
                <div className={classes.header}>
                    <div className={classes.filters}>
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
                    <div className={classes.bulkActions}>
                        {renderBulkActions()}
                    </div>
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
                            rowSelect={!!externalState.bulkItemActions}
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
                    pageSizes={pageSizes}
                />
            </div>
        </TableContext.Provider>
    )
}

export default Table;