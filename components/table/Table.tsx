import * as React from 'react';
import { type ITableInteraction, type ITableProps, type ITableState, TableSectionType  } from './types';
import TableSection from './components/TableSection';
import { getCellObserver, resizeTable } from './utils';
import Form from '@/backoffice-common/components/form/Form';
import classes from './Table.module.scss';
import { getCoreRowModel, getPaginationRowModel, type TableState, useReactTable } from '@tanstack/react-table'
import type { IFormValues } from '@/backoffice-common/components/form/helper';
import { initialState, reducer } from './reducer';
import { useFixedColumns } from './hooks';
import TablePagination from './components/pagination/TablePagination';
import { isRenderField, replacePathParameters } from '@/backoffice-common/utils';
import { usePathParameter, useRenderField } from '@/backoffice-common/hooks';
import { TableContext } from '@/backoffice-common/components/table/context';
import { allPass, eqProps, equals } from 'ramda';
import { Button, Menu } from '@mantine/core';
import BulkActionDrawer from './components/BulkActionDrawer';
import axios from 'axios';
import type { IResponse } from '@/backoffice-common/types/api';
import { IconAdjustments, IconDots } from '@tabler/icons-react';
import { showMessage } from '@/backoffice-common/lib/notification';
import { useTranslation } from 'react-i18next';

// compare 2 objects' given props values.
const check = allPass([
    eqProps('page'),
    eqProps('pageSize'),
])

const eqValues = (a1: unknown[], a2: unknown[]) => equals(new Set(a1), new Set(a2));

const Table = ({
    onInteract,
    rowActionButtons,
    state: externalState,
    pageSizes = [10, 20, 50],
    dispatch: dispatchExternalState,
    hideBulkActions = false,
    bulkActionUrlParser
}: ITableProps) => {
    const [ state, dispatch ] = React.useReducer(reducer, initialState);
    const tablesContainerRef = React.useRef<HTMLDivElement>(null);
    const columnObserverRef = React.useRef<ResizeObserver | null>(null);
    const { t } = useTranslation();

    const pathParameter = usePathParameter();
    const renderField = useRenderField();
    const fixedColumns = useFixedColumns(rowActionButtons);

    const tableColumns = React.useMemo(() => {
        if (!externalState.docs.length) {
            return externalState.columns;
        }
        return [
            ...fixedColumns,
            ...externalState.columns
        ]
    }, [ externalState.columns, fixedColumns, externalState.docs.length ]);

    const table = useReactTable({
        data: externalState.docs,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getRowId(originalRow) {
            return originalRow._id as string;
        },
        initialState: {
            columnPinning: {
                right: ['table-actions-column']
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
        state: {
            pagination: {
                pageIndex: externalState.page - 1,
                pageSize: externalState.pageSize,
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
        enableColumnPinning: true,
    });

    React.useEffect(() => {
        columnObserverRef.current = getCellObserver();

        if (tablesContainerRef.current) {
            const observer = new ResizeObserver((entries) => {
                const table = entries[0].target;
                if (table instanceof HTMLElement) {
                    resizeTable(table);
                }
            });
            observer.observe(tablesContainerRef.current);
        }
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
        };
        onInteract(params);
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

    // TODO: Split into its' own file
    const renderBulkActions = () => {
        if (!externalState.bulkItemActions  || !externalState.selectedRows?.length || hideBulkActions) {
            return null;
        }
        return (
            <>
                <BulkActionDrawer
                    filterValues={state.filter}
                    onClose={() => {
                        dispatch({
                            type: 'UPDATE_BULK_ACTION',
                            payload: undefined,
                        })
                    }}
                    bulkAction={state.selectedBulkAction}
                    onSubmit={async (values) => {
                        const url = replacePathParameters(state?.selectedBulkAction?.api?.uri ?? '', pathParameter);
                        const response = await axios<IResponse<unknown>>({
                            url: bulkActionUrlParser ? bulkActionUrlParser(url) : url,
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
                            showMessage(t('success', { ns: 'common' }), 'green');
                        }
                    }}
                />
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Button
                            leftSection={<IconAdjustments size={18}/>}
                            rightSection={<IconDots size={18}/>}
                            size='xs'
                            color='yellow'
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
                        />
                        <TableSection
                            section={TableSectionType.CENTER}
                            table={table}
                            rowSelect={hideBulkActions ? false : !!externalState.bulkItemActions}
                        />
                        <TableSection
                            section={TableSectionType.RIGHT}
                            table={table}
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
                    total={externalState.total}
                />
            </div>
        </TableContext.Provider>
    )
}

export default Table;