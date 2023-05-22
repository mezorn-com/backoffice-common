import * as React from 'react';
import type { ITableProps, ITableRowActionButton } from './types';
import { TableInstance, usePagination, useTable } from 'react-table';
import { append, assocPath, clone, path, prepend } from 'ramda';
import type { ArrayElement } from '@/backoffice-common/types/common';
import { useStyles } from './useStyles';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import { Anchor, Select } from '@mantine/core';
import { IFieldRenderType } from '@/backoffice-common/types/api';
import { useTranslation } from 'react-i18next';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import { TABLE_ROW_ACTION_BUTTON_POSITION } from '@/config';

const pageSizes = [10, 20, 30, 40, 50];

const Table = ({
    data,
    columns,
    onInteract,
    totalPage,
    rowActionButtons,
    rowActionButtonPosition = TABLE_ROW_ACTION_BUTTON_POSITION
}: ITableProps) => {
    const { t } = useTranslation();
    const { classes } = useStyles();

    const renderActionButton = (actionButton: ITableRowActionButton, index: number, table: TableInstance) => {
        if (typeof actionButton.label === 'function') {
            return (
                <div
                    key={`action-button-${index}`}
                    onClick={() => actionButton.onClick?.(table.row.original, table)}
                >
                    {
                        actionButton.label(table.row.original, table)
                    }
                </div>
            )
        }
        return (
            <div
                key={`action-button-${index}`}
                onClick={() => actionButton.onClick?.(table.row.original, table)}
            >
                {actionButton.label ?? null}
            </div>
        )
    }

    const tableColumns = React.useMemo(() => {
        let cols = clone(columns);
        if (rowActionButtons?.length) {
            const actionButtonsColumn: ArrayElement<typeof columns> = {
                accessor: 'table-actions',
                Header: '',
                Cell: function(table) {
                    return (
                        <div className={classes.actionButtons}>
                            {
                                rowActionButtons.map((actionButton, index) => renderActionButton(actionButton, index, table))
                            }
                        </div>
                    );
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

    const tableRecords = React.useMemo(() => {
        return data.map(record => {
            let recordClone = clone(record);
            for (const column of tableColumns) {
                // @ts-expect-error
                const valuePath = (column.key ?? '').split('.');
                // @ts-expect-error
                const renderType = column.renderType ?? 'text' as IFieldRenderType;
                let value: any = clone(path(valuePath, recordClone));
                if (renderType) {
                    switch(renderType) {
                        case 'text': {
                            break;
                        }
                        case 'boolean': {
                            value = value ? 'Yes' : 'No';
                            break;
                        }
                        case 'link': {
                            // @ts-expect-error
                            const uri: string = column.uri ?? '';
                            value = (
                                <Anchor target={'_blank'} href={getSubResourceUrl(uri, [ { match: '{_id}', replace: recordClone?._id ?? '' } ])}>{value}</Anchor>
                            );
                            break;
                        }
                        default: {
                            return recordClone;
                        }
                    }
                }
                recordClone = assocPath(valuePath, value, recordClone);
            }
            return recordClone;
        });
    }, [data, tableColumns]);

    const tableInstance = useTable({
        columns: tableColumns,
        data: tableRecords,
        initialState: {
            pageIndex: 0,
            pageSize: 10
        },
        pageCount: totalPage,
        manualPagination: true
    }, usePagination);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {
            pageIndex,
            pageSize,

        }
    } = tableInstance;

    React.useEffect(() => {
        handleInteraction();
    }, [pageIndex, pageSize]);

    const handleInteraction = () => {
        onInteract?.({
            page: pageIndex + 1,
            pageSize
        })
    }

    return (
        <div className={classes.tableWrapper}>
            <table {...getTableProps({ className: classes.table } )}>
                <thead>
                {
                    headerGroups.map((headerGroup) => {
                        return (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map((column) => {
                                        return (
                                            <th {...column.getHeaderProps({ className: classes.headerCell })}>
                                                {column.render('Header')}
                                                <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? ' 🔽'
                                                            : ' 🔼'
                                                        : ''}
                                                </span>
                                            </th>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
                </thead>
                <tbody {...getTableBodyProps()}>
                {
                    page.map((row, index) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {
                                    row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps({ className: classes.cell })}>
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <div className={classes.pagination}>
                <div className={classes.paginationControls}>
                    <button className={classes.paginationControlsButton} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        <IconChevronsLeft size={16}/>
                    </button>{' '}
                    <button className={classes.paginationControlsButton}  onClick={() => previousPage()} disabled={!canPreviousPage}>
                        <IconChevronLeft size={16}/>
                    </button>{' '}
                    <button className={classes.paginationControlsButton}  onClick={() => nextPage()} disabled={!canNextPage}>
                        <IconChevronRight size={16}/>
                    </button>{' '}
                    <button className={classes.paginationControlsButton}  onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        <IconChevronsRight size={16}/>
                    </button>{' '}
                </div>
                <div className={classes.paginationPaging}>
                    {`${t('page', { ns: 'table' })} `}
                    <strong>
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                            className={classes.paginationInput}
                        /> / {pageOptions.length}
                    </strong>{' '}
                </div>
                <Select
                    data={pageSizes.map(pageSize => {return {value: `${pageSize}`, label: `${pageSize}`}})}
                    onChange={e => {setPageSize(Number(e))}}
                    defaultValue={pageSizes[0].toString()}
                    wrapperProps={{
                        style: {
                            width: 80
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default Table;