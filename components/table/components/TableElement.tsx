import * as React from 'react';
import { flexRender, HeaderGroup, Cell, Table, Row } from '@tanstack/react-table';
import { useStyles } from '@/backoffice-common/components/table/useStyles';
import { ListDoc } from '@/backoffice-common/types/common/list';
import { useResizeObserver } from '@mantine/hooks';
import { getRowClassName } from '@/backoffice-common/components/table/utilts';
import TableRow from './Row';

type Type = 'left' | 'center' | 'right';

interface TableElementProps {
    type: Type,
    table: Table<ListDoc>,
    bodyRef: React.MutableRefObject<HTMLDivElement | null>;
    style?: React.CSSProperties;
    onResize: (height: number, rowId: string) => void;
}

const TableElement = ({
    type,
    table,
    bodyRef,
    onResize,
    style
}: TableElementProps) => {
    const { classes } = useStyles();

    const [ ref, { height } ] = useResizeObserver();

    React.useEffect(() => {
        onResize(height, '')
    }, [height]);

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
        <div
            style={{
                overflowX: type === 'center' ? 'auto' : 'hidden',
                overflowY: 'hidden',
                maxHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                // width: getWidth(),
                ...style
            }}
        >
            <div
                className='divTable'
                style={{
                    width: getWidth(),
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflow:'hidden'
                }}
                ref={ref}
            >
                <div
                    className='thead'
                >
                    {
                        getHeaderGroups().map(headerGroup => {
                            const id = headerGroup.id.split('_')[1];
                            const rowId = getRowClassName(id) + '-col-' + type;
                            return (
                                <TableRow key={headerGroup.id}>
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
                <div className={`tbody ${type === 'center' ? classes.z : ''}`} style={{ flex: 1, overflow: 'auto', border: '0px solid red' }} ref={bodyRef}>
                    {
                        table.getRowModel().rows.map(row => {
                            const rowId = getRowClassName(row.id) + '-' + type;
                            return (
                                <TableRow key={row.id}>
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

export default TableElement;