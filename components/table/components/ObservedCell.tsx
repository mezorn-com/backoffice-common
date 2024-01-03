import * as React from 'react';
import { TableContext } from '../context';
import classes from './ObservedCell.module.scss';
import { RowGroup } from '../types';
import { COLUMN_UID_ATTR, ROW_GROUP_UID_ATTR, ROW_UID_ATTR } from '../utils';
import { clsx } from 'clsx';

interface ObservedCellProps {
    children?: React.ReactNode;
    columnId: string;
    rowId: string;
    rowGroup: RowGroup;
}

const ObservedCell = ({
    children,
    columnId,
    rowId,
    rowGroup
}: ObservedCellProps) => {
    const { columnObserver } = React.useContext(TableContext);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (columnObserver && ref.current) {
            columnObserver.observe(ref.current)
        }
    }, [ columnObserver ]);

    const attributes = React.useMemo(() => {
        return {
            [COLUMN_UID_ATTR]: columnId,
            [ROW_UID_ATTR]: rowId,
            [ROW_GROUP_UID_ATTR]: rowGroup
        }
    }, [ columnId, rowId, rowGroup ])

    return (
        <div {...attributes} className={classes.container}>
            <div
                {...attributes}
                ref={ref}
                className={clsx({
                    [classes.cell]: rowGroup !== RowGroup.HEADER,
                    [classes.header]: rowGroup === RowGroup.HEADER
                })}
            >
                {children}
            </div>
        </div>
    )
}

export default ObservedCell;