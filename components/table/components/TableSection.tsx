import * as React from 'react';
import { type Cell, flexRender, type HeaderGroup, type Row, type Table } from '@tanstack/react-table';
import { Checkbox, type CheckboxProps } from '@mantine/core';
import type { ListDoc } from '@/backoffice-common/types/common/list';
import TableRow from './Row';
import { RowGroup, TableSectionType } from '../types';
import ObservedCell from './ObservedCell';
import Placeholder from './Placeholder';
import { clsx } from 'clsx';
import classes from './TableSection.module.scss';
import SectionBody from '../components/SectionBody';
import { TableContext } from '../context';

interface TableElementProps {
    section: TableSectionType,
    table: Table<ListDoc>,
    rowSelect?: boolean;
}

const isHeaderGroup = (row: Row<ListDoc> | HeaderGroup<ListDoc>): row is HeaderGroup<ListDoc> => {
    return 'headers' in row;
}

const CHECKBOX_COLUMN_ID = 'table-bulk-action-checkbox';

const useSectionFlatHeaders = (section: TableSectionType, table: Table<ListDoc>) => {
    switch(section) {
        case TableSectionType.LEFT: {
            return table.getLeftFlatHeaders();
        }
        case TableSectionType.CENTER: {
            return table.getCenterFlatHeaders();
        }
        case TableSectionType.RIGHT: {
            return table.getRightFlatHeaders();
        }
        default: {
            return []
        }
    }
}

const TableSection = ({
    section,
    table,
    rowSelect
}: TableElementProps) => {
    const flatHeaders = useSectionFlatHeaders(section, table);
    const tablesContainerRef = React.useRef<HTMLDivElement>(null);
    const { setRowHoverIndex } = React.useContext(TableContext);

    const visible = section === TableSectionType.CENTER || flatHeaders.length > 0;

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
            <ObservedCell rowGroup={rowGroup} rowId={rowId} columnId={CHECKBOX_COLUMN_ID}>
                <div className={classes.checkbox}>
                    <Checkbox
                        {...props}
                    />
                </div>
            </ObservedCell>
        )
    }

    return (
        <div
            className={clsx({
                [classes.container]: true,
                [classes.center]: section === TableSectionType.CENTER,
                [classes.left]: section === TableSectionType.LEFT,
                [classes.right]: section === TableSectionType.RIGHT,
                [classes.visible]: visible
            })}
            onMouseLeave={() => {
                setRowHoverIndex(null);
            }}
        >
            <div
                className={classes.wrapper}
                ref={section === TableSectionType.CENTER ? tablesContainerRef : undefined}
            >
                <div className={classes.head}>
                    {
                        getHeaderGroups().map((headerGroup, index) => {
                            const rowId = headerGroup.id.split('_')[1];
                            return (
                                <TableRow key={headerGroup.id} rowId={rowId} rowGroup={RowGroup.HEADER} rowIndex={index}>
                                    {renderCheckBox(headerGroup)}
                                    {
                                        headerGroup.headers.map(header => {
                                            return (
                                                <ObservedCell
                                                    key={header.id}
                                                    columnId={header.id}
                                                    rowId={rowId}
                                                    rowGroup={RowGroup.HEADER}
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
                {
                    table.getRowModel().rows.length
                    ?   <SectionBody
                            className={clsx({
                                [classes.body]: true,
                                [classes.scrollHidden]: section === TableSectionType.CENTER
                            })}
                        >
                            {
                                table.getRowModel().rows.map((row, index) => {
                                    return (
                                        <TableRow key={row.id} rowId={row.id} rowGroup={RowGroup.BODY} rowIndex={index}>
                                            {renderCheckBox(row)}
                                            {
                                                getVisibleCells(row).map(cell => {
                                                    return (
                                                        <ObservedCell
                                                            key={cell.id}
                                                            columnId={cell.column.id}
                                                            rowId={row.id}
                                                            rowGroup={RowGroup.BODY}
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
                        </SectionBody>
                    :   flatHeaders.length === 0
                        ?   null
                        :   <Placeholder/>
                }
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