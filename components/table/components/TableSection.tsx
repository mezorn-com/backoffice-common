import * as React from 'react';
import { Cell, flexRender, HeaderGroup, Row, Table } from '@tanstack/react-table';
import { Checkbox, CheckboxProps } from '@mantine/core';
import { useSectionStyles } from './useSectionStyles';
import { ListDoc } from '@/backoffice-common/types/common/list';
import { COLUMN_UID_ATTR, ROW_GROUP_UID_ATTR, ROW_UID_ATTR, RowGroup } from '../utils';
import TableRow from './Row';
import { TableSectionType } from '../types';
import ObservedCell from './ObservedCell';

interface TableElementProps {
    section: TableSectionType,
    table: Table<ListDoc>,
    bodyRef: React.MutableRefObject<HTMLDivElement | null>;
    rowSelect?: boolean;
}

const getColumnAttributes = (columnId: string, rowId: string, rowGroup: RowGroup) => {
    return {
        [COLUMN_UID_ATTR]: columnId,
        [ROW_UID_ATTR]: rowId,
        [ROW_GROUP_UID_ATTR]: rowGroup
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
    rowSelect
}: TableElementProps) => {
    const { classes } = useSectionStyles({ sectionType: section });
    const tablesContainerRef = React.useRef<HTMLDivElement>(null);

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
        if (section !== TableSectionType.CENTER || !rowSelect) {
            return null;
        }

        const isHeader = isHeaderGroup(row);

        let rowId = row.id;

        const props: CheckboxProps = {
            size: 'xs',
            indeterminate: isHeader && table.getIsSomeRowsSelected(),
        }

        if (isHeader) {
            rowId = rowId.split('_')[1];
            props.checked = table.getIsAllPageRowsSelected();
            props.onChange = () => table.toggleAllPageRowsSelected(!table.getIsAllPageRowsSelected())
        } else {
            props.checked = row.getIsSelected();
            props.onChange = () => row.toggleSelected(!row.getIsSelected());
        }
        let rowGroup = isHeader ? RowGroup.HEADER : RowGroup.BODY;
        return (
            // assuming checkboxes won't be rendered in footer group
            <ObservedCell attrs={getColumnAttributes(CHECKBOX_COLUMN_ID, rowId, rowGroup)}>
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
                                            const colAttributes = getColumnAttributes(header.id, rowId, RowGroup.HEADER)
                                            return (
                                                <ObservedCell
                                                    attrs={colAttributes}
                                                    key={header.id}
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

                                            const colAttributes = getColumnAttributes(cell.column.id, row.id, RowGroup.BODY)
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