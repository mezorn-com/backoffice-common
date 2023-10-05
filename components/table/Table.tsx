import * as React from 'react';
import type { ITableInteraction, ITableProps, ITableState } from './types';
import { append, assocPath, clone, path, prepend, eqProps, allPass } from 'ramda';
import type { ArrayElement } from '@/backoffice-common/types/common';
import { useStyles } from './useStyles';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconDatabaseX } from '@tabler/icons-react';
import { Anchor, NumberInput, Select, ActionIcon } from '@mantine/core';
import { IFieldRenderType } from '@/backoffice-common/types/api';
import { useTranslation } from 'react-i18next';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import { TABLE_ROW_ACTION_BUTTON_POSITION } from '@/config';
import TableFilter from './filter';

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

const pageSizes = [10, 20, 30, 40, 50];

const Table = ({
    onInteract,
    rowActionButtons,
    rowActionButtonPosition = TABLE_ROW_ACTION_BUTTON_POSITION,
    state: externalState
}: ITableProps) => {
    const { t } = useTranslation();
    const { classes } = useStyles();
    const [ state, dispatch ] = React.useReducer(reducer, initialState);

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

                // size: seconds
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
        renderFallbackValue: '-'
    })

    console.log('table>>>', table)

    // console.log('Table State>>>>', table.getState());
    // console.log('Props State>>>>', externalState);

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
                <div style={{ overflowX: 'auto', overflowY: 'hidden', maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div
                        className='divTable'
                        style={{
                            width: table.getTotalSize(),
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            overflow:'hidden'
                        }}
                    >
                        <div
                            className='thead'
                        >
                            {
                                table.getLeftHeaderGroups().map(headerGroup => {
                                    return (
                                        <div key={headerGroup.id} className={classes.row}>
                                            {
                                                headerGroup.headers.map(header => {
                                                    return (
                                                        <div
                                                            key={header.id}
                                                            className={classes.headerCell}
                                                            style={{
                                                                width: header.getSize()
                                                            }}
                                                        >
                                                            {
                                                                header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                        header.column.columnDef.header,
                                                                        header.getContext()
                                                                    )
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='tbody' style={{ flex: 1, overflow: 'auto' }}>
                            {
                                table.getRowModel().rows.map(row => {
                                    return (
                                        <div key={row.id} className={classes.row}>
                                            {
                                                row.getVisibleCells().map(cell => {
                                                    return (
                                                        <div
                                                            key={cell.id}
                                                            className='td'
                                                            style={{
                                                                width: cell.column.getSize()
                                                        }}
                                                        >
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='tfoot'>
                            {
                                table.getFooterGroups().map(footerGroup => {
                                    return (
                                        <div key={footerGroup.id} className='tr'>
                                            {
                                                footerGroup.headers.map(header => {
                                                    return (
                                                        <div
                                                            key={header.id}
                                                            className={classes.headerCell}
                                                            style={{ width: header.getSize() }}
                                                        >
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                    header.column.columnDef.footer,
                                                                    header.getContext()
                                                                )}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                {/*<table className={classes.table}>*/}
                {/*    <thead>*/}
                {/*    {table.getHeaderGroups().map(headerGroup => (*/}
                {/*        <tr key={headerGroup.id}>*/}
                {/*            {*/}
                {/*                headerGroup.headers.map(header => {*/}
                {/*                    return (*/}
                {/*                        <th key={header.id} colSpan={header.colSpan} className={classes.headerCell} style={{ width: header.getSize() }}>*/}
                {/*                            {*/}
                {/*                                header.isPlaceholder*/}
                {/*                                    ? null*/}
                {/*                                    : flexRender(*/}
                {/*                                        header.column.columnDef.header,*/}
                {/*                                        header.getContext()*/}
                {/*                                    )*/}
                {/*                            }*/}
                {/*                        </th>*/}
                {/*                    )*/}
                {/*                })*/}
                {/*            }*/}
                {/*        </tr>*/}
                {/*    ))}*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*    {*/}
                {/*        table.getRowModel().rows.length*/}
                {/*            ?   table.getRowModel().rows.map(row => (*/}
                {/*                    <tr key={row.id}>*/}
                {/*                        {*/}
                {/*                            row.getVisibleCells().map(cell => {*/}
                {/*                                return (*/}
                {/*                                    <td key={cell.id} className={classes.cell}>*/}
                {/*                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}*/}
                {/*                                    </td>*/}
                {/*                                )*/}
                {/*                            })*/}
                {/*                        }*/}
                {/*                    </tr>*/}
                {/*                ))*/}
                {/*            :   (*/}
                {/*                <tr>*/}
                {/*                    <td colSpan={1000}>*/}
                {/*                        <div className={classes.noData}>*/}
                {/*                            <IconDatabaseX size={50} color={'gray'}/>*/}
                {/*                        </div>*/}
                {/*                    </td>*/}
                {/*                </tr>*/}
                {/*            )*/}
                {/*    }*/}
                {/*    </tbody>*/}
                {/*    <tfoot>*/}
                {/*    {table.getFooterGroups().map(footerGroup => (*/}
                {/*        <tr key={footerGroup.id}>*/}
                {/*            {footerGroup.headers.map(header => (*/}
                {/*                <th key={header.id} colSpan={header.colSpan}>*/}
                {/*                    {header.isPlaceholder*/}
                {/*                        ? null*/}
                {/*                        : flexRender(*/}
                {/*                            header.column.columnDef.footer,*/}
                {/*                            header.getContext()*/}
                {/*                        )}*/}
                {/*                </th>*/}
                {/*            ))}*/}
                {/*        </tr>*/}
                {/*    ))}*/}
                {/*    </tfoot>*/}
                {/*</table>*/}
            </div>
            <div className={classes.pagination}>
                <div className={classes.paginationControls}>
                    <ActionIcon
                        variant='filled'
                        color='color.primary'
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <IconChevronsLeft size={16}/>
                    </ActionIcon>
                    <ActionIcon
                        variant='filled'
                        color='color.primary'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <IconChevronLeft size={16}/>
                    </ActionIcon>
                    <ActionIcon
                        variant='filled'
                        color='color.primary'
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <IconChevronRight size={16}/>
                    </ActionIcon>
                    <ActionIcon
                        variant='filled'
                        color='color.primary'
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <IconChevronsRight size={16}/>
                    </ActionIcon>
                </div>
                <div className={classes.totalPage}>
                    Page
                    <NumberInput
                        type="number"
                        value={externalState.page}
                        onChange={e => {
                            const page = e ? Number(e) : 0;
                            table.setPageIndex(page);
                        }}
                        style={{ width: '100px' }}
                        className={classes.paginationInput}
                        min={1}
                        size='xs'
                    />
                    / {table.getPageCount()}
                </div>
                <Select
                    data={pageSizes.map(pageSize => {return {value: `${pageSize}`, label: `${pageSize}`}})}
                    onChange={e => {table.setPageSize(Number(e))}}
                    wrapperProps={{
                        style: {
                            width: 80
                        }
                    }}
                    value={externalState.pageSize.toString()}
                    size='xs'
                />
            </div>
        </div>
    )
}

export default Table;