import * as React from 'react';
import { flexRender, HeaderGroup, RowModel, Cell } from '@tanstack/react-table';
import { useStyles } from '@/backoffice-common/components/table/useStyles';
import { ListDoc } from '@/backoffice-common/types/common/list';

interface IProps {
    rowModel: RowModel<ListDoc>;
    headerGroups: HeaderGroup<ListDoc>[];
    footerGroups: HeaderGroup<ListDoc>[];
    cells: Cell<ListDoc, unknown>[];
    width: number;
    horizontalScroll?: boolean;
    bodyRef: React.MutableRefObject<HTMLDivElement | null>;
    style?: React.CSSProperties;
}

const TableElement = ({
    headerGroups,
    footerGroups,
    rowModel,
    width,
    horizontalScroll = false,
    bodyRef,
    style
}: IProps) => {
    const { classes } = useStyles();

    return (
        <div
            style={{
                overflowX: horizontalScroll ? 'auto' : 'hidden',
                overflowY: 'hidden',
                maxHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                width,
                ...style
            }}
        >
            <div
                className='divTable'
                style={{
                    width,
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
                        headerGroups.map(headerGroup => {
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
                <div className='tbody' style={{ flex: 1, overflow: 'auto', border: '2px solid red' }} ref={bodyRef}>
                    {
                        rowModel.rows.map(row => {
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
                        footerGroups.map(footerGroup => {
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