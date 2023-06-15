import * as React from 'react';
import type { ITableProps, ITableState } from './types';
import { append, assocPath, clone, path, prepend, eqProps, allPass } from 'ramda';
import type { ArrayElement } from '@/backoffice-common/types/common';
import { useStyles } from './useStyles';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { Anchor, NumberInput, Select } from '@mantine/core';
import { IFieldRenderType } from '@/backoffice-common/types/api';
import { useTranslation } from 'react-i18next';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import { TABLE_ROW_ACTION_BUTTON_POSITION } from '@/config';

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

const pageSizes = [10, 20, 30, 40, 50];

const Table = ({
    data,
    columns,
    onInteract,
    rowActionButtons,
    rowActionButtonPosition = TABLE_ROW_ACTION_BUTTON_POSITION,
    state
}: ITableProps) => {
    const { t } = useTranslation();
    const { classes } = useStyles();

    const tableColumns = React.useMemo(() => {
        let cols = clone(columns);
        if (rowActionButtons?.length) {
            const actionButtonsColumn: ColumnDef<any> = {
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
                }
            }
            if (rowActionButtonPosition === 'right') {
                cols = append(
                    actionButtonsColumn,
                    columns
                );
            } else {
                cols = prepend(
                    actionButtonsColumn,
                    columns
                );
            }
        }

        return cols;
    }, [ columns, rowActionButtons ]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: state.pageSize,
                pageIndex: state.page - 1,
            }
        },
        manualPagination: true,
        onStateChange: (updater) => {
            if (updater instanceof Function) {
                const newState = updater(table.getState());
                handleTableInteraction(newState);
            }
        },
    })

    // console.log('Table State>>>>', table.getState());
    // console.log('Props State>>>>', state);

    // compare 2 objects' given props values.
    const check = allPass([
        eqProps('page'),
        eqProps('pageSize'),
    ])

    const handleTableInteraction = (updatedTableState: TableState) => {
        const updatedState: ITableState = {
            page: updatedTableState.pagination.pageIndex + 1,
            pageSize: updatedTableState.pagination.pageSize,
        }
        if (!check(state, updatedState)) {
            onInteract(updatedState);
        }
    }

    table.setOptions(prev => ({
        ...prev,
        // state,
        pageCount: state.totalPage,
        pagination: {
            pageSize: state.pageSize,
            pageIndex: state.page - 1
        },
        debugTable: true,
    }));

    const renderActionButton = (actionButton: IRowActionButton, index: number, props: CellContext<any, any>) => {
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
    //
    // const tableRecords = React.useMemo(() => {
    //     return data.map(record => {
    //         let recordClone = clone(record);
    //         for (const column of tableColumns) {
    //             // @ts-expect-error
    //             const valuePath = (column.key ?? '').split('.');
    //             // @ts-expect-error
    //             const renderType = column.renderType ?? 'text' as IFieldRenderType;
    //             let value: any = clone(path(valuePath, recordClone));
    //             if (renderType) {
    //                 switch(renderType) {
    //                     case 'text': {
    //                         break;
    //                     }
    //                     case 'boolean': {
    //                          TODO: change this.
    //                          it should not render 'NO' when value is null or undefined.
    //                          also display some icon or something;
    //                         value = value ? 'Yes' : 'No';
    //                         break;
    //                     }
    //                     case 'link': {
    //                         // @ts-expect-error
    //                         const uri: string = column.uri ?? '';
    //                         value = (
    //                             <Anchor target={'_blank'} href={getSubResourceUrl(uri, [ { match: '{_id}', replace: recordClone?._id ?? '' } ])}>{value}</Anchor>
    //                         );
    //                         break;
    //                     }
    //                     default: {
    //                         return recordClone;
    //                     }
    //                 }
    //             }
    //             recordClone = assocPath(valuePath, value, recordClone);
    //         }
    //         return recordClone;
    //     });
    // }, [data, tableColumns]);

    return (
        <div className={classes.tableWrapper}>
            <table className={classes.table}>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} colSpan={header.colSpan} className={classes.headerCell}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className={classes.cell}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
                <tfoot>
                {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map(header => (
                            <th key={header.id} colSpan={header.colSpan}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </tfoot>
            </table>
            <div className={classes.pagination}>
                <div className={classes.paginationControls}>
                    <button
                        className={classes.paginationControlsButton}
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <IconChevronsLeft size={16}/>
                    </button>{' '}
                    <button
                        className={classes.paginationControlsButton}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <IconChevronLeft size={16}/>
                    </button>{' '}
                    <button
                        className={classes.paginationControlsButton}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <IconChevronRight size={16}/>
                    </button>{' '}
                    <button
                        className={classes.paginationControlsButton}
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <IconChevronsRight size={16}/>
                    </button>{' '}
                </div>
                <div className={classes.totalPage}>
                    Page
                    <NumberInput
                        type="number"
                        value={state.page}
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
                    value={state.pageSize.toString()}
                />
            </div>
        </div>
    )
}

export default Table;