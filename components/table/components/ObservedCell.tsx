import * as React from 'react';
import { TableContext } from '../context';
import { createStyles } from '@mantine/core';
import { TABLE_BORDER_COLOR, TABLE_BORDER_COLOR_INDEX } from '../constants';
import { RowGroup } from '../types';
import { COLUMN_UID_ATTR, ROW_GROUP_UID_ATTR, ROW_UID_ATTR } from '../utils';

interface StyleParams {
    rowGroup: RowGroup
}

const useStyles = createStyles((theme, { rowGroup }: StyleParams) => {
    return {
        container: {
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
            borderRight: `1px solid ${theme.colors[TABLE_BORDER_COLOR][TABLE_BORDER_COLOR_INDEX]}`,
            '&:last-of-type': {
                borderRightWidth: 0
            }
        },
        cell: {
            width: 'min-content',
            padding: '.3rem .5rem',
            fontSize: rowGroup === RowGroup.HEADER ? 15 : 14,
            fontWeight: rowGroup === RowGroup.HEADER ? 500 : undefined,
            color: theme.colors.gray[8]
        }
    }
})

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
    const { classes } = useStyles({ rowGroup });
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
                className={classes.cell}
            >
                {children}
            </div>
        </div>
    )
}

export default ObservedCell;