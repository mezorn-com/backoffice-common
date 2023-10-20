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
    const { classes } = useSectionStyles({ sectionType: type });
    const tablesContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (type === 'center' &&  tablesContainerRef.current) {
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
        switch(type) {
            case 'left': {
                return table.getLeftHeaderGroups();
            }
            case 'center': {
                return table.getCenterHeaderGroups();
            }
            case 'right': {
                return table.getRightHeaderGroups();
            }
            default: {
                return []
            }
        }
    }

    const getFooterGroups = (): HeaderGroup<ListDoc>[] => {
        switch(type) {
            case 'left': {
                return table.getLeftFooterGroups();
            }
            case 'center': {
                return table.getCenterFooterGroups();
            }
            case 'right': {
                return table.getRightFooterGroups();
            }
            default: {
                return []
            }
        }
    }

    const getVisibleCells = (row: Row<ListDoc>): Cell<ListDoc, unknown>[] => {
        switch(type) {
            case 'left': {
                return row.getLeftVisibleCells();
            }
            case 'center': {
                return row.getCenterVisibleCells();
            }
            case 'right': {
                return row.getRightVisibleCells();
            }
            default: {
                return []
            }
        }
    }

    const getWidth = (): number => {
        switch(type) {
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
                ref={type === 'center' ? tablesContainerRef : undefined}
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
                                </TableRow>
                            )
                        })
                    }
                </div>
                <div className='tfoot'>
                    {
                        getFooterGroups().map(footerGroup => {
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
    )
};

export default TableSection;