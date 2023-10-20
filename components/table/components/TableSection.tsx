import * as React from 'react';
import { flexRender, HeaderGroup, Cell, Table, Row } from '@tanstack/react-table';
import { useSectionStyles } from './useSectionStyles';
import { ListDoc } from '@/backoffice-common/types/common/list';
import { getMutationObserver } from '../utilts';
import TableRow from './Row';
import { TableSectionType } from '../types';

interface TableElementProps {
    section: TableSectionType,
    table: Table<ListDoc>,
    bodyRef: React.MutableRefObject<HTMLDivElement | null>;
}

const TableSection = ({
    section,
    table,
    bodyRef,
}: TableElementProps) => {
    const { classes } = useSectionStyles({ sectionType: section });
    const tablesContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (section === 'center' &&  tablesContainerRef.current) {
            const tableBody = tablesContainerRef.current.querySelector('.tbody');
            if (tableBody) {
                const mutationObserver = getMutationObserver();
                mutationObserver.observe(tableBody,{
                    attributes: false,
                    childList: true,
                    subtree: false
                });
                return () => {
                    mutationObserver.disconnect();
                }
            }
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

    const getWidth = (): number => {
        switch(section) {
            case 'left': {
                return table.getLeftTotalSize();
            }
            case 'center': {
                return table.getCenterTotalSize();
            }
            case 'right': {
                return table.getRightTotalSize();
            }
            default: {
                return 0;
            }
        }
    }

    return (
        <div className={classes.container}>
            <div
                className={classes.wrapper}
                style={{ width: getWidth() }}
                ref={section === TableSectionType.CENTER ? tablesContainerRef : undefined}
            >
                {/*Using `thead` class for css selector */}
                <div className='thead'>
                    {
                        getHeaderGroups().map(headerGroup => {
                            return (
                                <TableRow key={headerGroup.id} rowId={headerGroup.id}>
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
                                </TableRow>
                            )
                        })
                    }
                </div>
                <div className={`tbody ${classes.body}`} ref={bodyRef}>
                    {
                        table.getRowModel().rows.map(row => {
                            return (
                                <TableRow key={row.id} rowId={row.id}>
                                    {
                                        getVisibleCells(row).map(cell => {
                                            return (
                                                <div
                                                    key={cell.id}
                                                    style={{
                                                        width: cell.column.getSize()
                                                    }}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
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
    )
};

export default TableSection;