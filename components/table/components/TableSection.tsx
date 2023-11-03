import * as React from 'react';
import { Cell, flexRender, HeaderGroup, Row, Table, RowSelectionState } from '@tanstack/react-table';
import { useSectionStyles } from './useSectionStyles';
import { ListDoc } from '@/backoffice-common/types/common/list';
import { COLUMN_UID_ATTR, ROW_PREFIX } from '../utils';
import TableRow from './Row';
import { TableSectionType } from '../types';
import ObservedCell from '@/backoffice-common/components/table/components/ObservedCell';
import { Checkbox, CheckboxProps } from '@mantine/core';

interface TableElementProps {
    section: TableSectionType,
    table: Table<ListDoc>,
    bodyRef: React.MutableRefObject<HTMLDivElement | null>;
}

const getColumnAttributes = (columnId: string, rowId: string, isHeaderCol?: 'true') => {
    return {
        [COLUMN_UID_ATTR]: columnId,
        [ROW_PREFIX]: rowId,
        ['header-col']: isHeaderCol
    }
}

const isHeaderGroup = (row: Row<ListDoc> | HeaderGroup<ListDoc>): row is HeaderGroup<ListDoc> => {
    return 'headers' in row;
}

const CHECKBOX_COLUMN_ID = 'table-bulk-action-checkbox';

const TableSection = ({
    section,
    table,
    bodyRef,
}: TableElementProps) => {
    const { classes } = useSectionStyles({ sectionType: section });
    const tablesContainerRef = React.useRef<HTMLDivElement>(null);

    // console.log('ROW SELECTION>>>', table.getState());
    // console.log('ROW SELECTION>>>', table.getSelectedRowModel());

    // console.log('table>>>', table.setRowSelection({
    //
    // }));

    React.useEffect(() => {
        if (section === 'center' &&  tablesContainerRef.current) {

            // Temp code to make table full width when table is small.
            // const tableWidthObserver = getCenterTableWidthObserver();
            // const container = tablesContainerRef.current.parentElement;
            // container && tableWidthObserver.observe(container);


            // const tableHead = tablesContainerRef.current.querySelector('.thead');
            //
            // if (tableHead) {
            //     if (tableHead.children.length) {
            //         for (const row of tableHead.children) {
            //             assignZ(row, '.thead')
            //         }
            //     }
            //     const mutationObserver = getTableRowMutationObserver('.thead');
            //     mutationObserver.observe(tableHead,{
            //         attributes: false,
            //         childList: true,
            //         subtree: false
            //     });
            //     // return () => {
            //     //     mutationObserver.disconnect();
            //     // }
            // }



            // const tableBody = tablesContainerRef.current.querySelector('.tbody');
            // if (tableBody) {
            //     const mutationObserver = getTableRowMutationObserver('.tbody');
            //     mutationObserver.observe(tableBody,{
            //         attributes: false,
            //         childList: true,
            //         subtree: false
            //     });
            //     return () => {
            //         mutationObserver.disconnect();
            //     }
            // }
        }
    }, [])

    const getHeaderGroups = (): HeaderGroup<ListDoc>[] => {
        switch(section) {
            case TableSectionType.LEFT: {
                return table.getLeftHeaderGroups();
            }
            case TableSectionType.CENTER: {
                return table.getCenterHeaderGroups();
            }
            case TableSectionType.RIGHT: {
                return table.getRightHeaderGroups();
            }
            default: {
                return []
            }
        }
    }

    const getFooterGroups = (): HeaderGroup<ListDoc>[] => {
        switch(section) {
            case TableSectionType.LEFT: {
                return table.getLeftFooterGroups();
            }
            case TableSectionType.CENTER: {
                return table.getCenterFooterGroups();
            }
            case TableSectionType.RIGHT: {
                return table.getRightFooterGroups();
            }
            default: {
                return []
            }
        }
    }

    const getVisibleCells = (row: Row<ListDoc>): Cell<ListDoc, unknown>[] => {
        switch(section) {
            case TableSectionType.LEFT: {
                return row.getLeftVisibleCells();
            }
            case TableSectionType.CENTER: {
                return row.getCenterVisibleCells();
            }
            case TableSectionType.RIGHT: {
                return row.getRightVisibleCells();
            }
            default: {
                return []
            }
        }
    }

    const renderCheckBox = (row: Row<ListDoc> | HeaderGroup<ListDoc>): React.ReactNode => {
        if (section !== TableSectionType.CENTER) {
            return null;
        }

        let rowId = row.id;

        const props: CheckboxProps = {
            size: 'xs',
            indeterminate: isHeaderGroup(row) && table.getIsSomeRowsSelected(),
        }

        if (isHeaderGroup(row)) {
            rowId = rowId.split('_')[1];
            props.checked = table.getIsAllPageRowsSelected();
            props.onChange = () => table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected())
        } else {
            props.checked = row.getIsSelected();
            props.onChange = () => row.toggleSelected(!row.getIsSelected());
        }
        return (
            <ObservedCell attrs={getColumnAttributes(CHECKBOX_COLUMN_ID, rowId)}>
                <div style={{ height: '100%', display: 'flex', placeItems: 'center' }}>
                    <Checkbox
                        {...props}
                    />
                </div>
            </ObservedCell>
        )
    }

    return (
        <div className={classes.container}>
            <div
                className={classes.wrapper}
                ref={section === TableSectionType.CENTER ? tablesContainerRef : undefined}
            >
                {/*Using `thead` class for css selector */}
                <div className={`thead ${classes.head}`}>
                    {
                        getHeaderGroups().map(headerGroup => {
                            const rowId = headerGroup.id.split('_')[1];
                            return (
                                <TableRow key={headerGroup.id} rowId={rowId}>
                                    {renderCheckBox(headerGroup)}
                                    {
                                        headerGroup.headers.map(header => {
                                            const colAttributes = getColumnAttributes(header.id, rowId, 'true')
                                            return (
                                                <ObservedCell
                                                    attrs={colAttributes}
                                                    key={header.id}
                                                    // className={classes.headerCell}
                                                >
                                                    {
                                                        header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )
                                                    }
                                                </ObservedCell>
                                            )
                                        })
                                    }
                                </TableRow>
                            )
                        })
                    }
                </div>
                {/*Using `tbody` class for css selector */}
                <div className={`tbody ${classes.body}`} ref={bodyRef}>
                    {
                        table.getRowModel().rows.map(row => {
                            return (
                                <TableRow key={row.id} rowId={row.id}>
                                    {renderCheckBox(row)}
                                    {
                                        getVisibleCells(row).map(cell => {

                                            const colAttributes = getColumnAttributes(cell.column.id, row.id)
                                            return (
                                                <ObservedCell
                                                    attrs={colAttributes}
                                                    key={cell.id}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </ObservedCell>
                                            )
                                        })
                                    }
                                </TableRow>
                            )
                        })
                    }
                </div>
                <div className='tfoot'>
                    {
                        getFooterGroups().map(footerGroup => {
                            return (
                                <div key={footerGroup.id}>
                                    {
                                        footerGroup.headers.map(header => {
                                            return (
                                                <div key={header.id}>
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
    )
};

export default TableSection;