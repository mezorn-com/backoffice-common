import * as React from 'react';
import { ROW_UID_ATTR } from '../utils';
import { createStyles } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { TABLE_BORDER_COLOR, TABLE_BORDER_COLOR_INDEX } from '../constants';
import { RowGroup } from '../types';

interface TableRowProps {
    children: React.ReactNode;
    rowId: string;
    rowGroup: RowGroup;
}

interface StyleParams extends Pick<TableRowProps, 'rowGroup'> {

}

const useStyles = createStyles((theme, { rowGroup }: StyleParams) => {
    return {
        container: {
            display: 'flex',
            alignItems: 'flex-end',
            height: 'fit-content',
            borderBottom: `1px solid ${theme.colors[TABLE_BORDER_COLOR][TABLE_BORDER_COLOR_INDEX]}`,
            '&:last-of-type': {
                borderBottomWidth: 0
            },
            '&:hover': {
                backgroundColor: rowGroup !== RowGroup.HEADER ? theme.colors.gray[0] : 'transparent'
            }
        }
    }
})

const TableRow = ({
    children,
    rowId,
    rowGroup
}: TableRowProps) => {

    const { classes } = useStyles({ rowGroup });
    const rowRef = React.useRef<HTMLDivElement>(null);
    const forceUpdate = useForceUpdate();

    React.useEffect(() => {
        if (rowRef.current) {
            forceUpdate();
        }
    }, [rowRef.current])

    const renderCell = () => {
        if (!rowRef.current) {
            return null;
        }
        return children;
    }

    const customAttrs = {
        [ROW_UID_ATTR]: rowId
    }

    return (
        <div {...customAttrs} className={classes.container} ref={rowRef}>
            {renderCell()}
        </div>
    )
};

export default TableRow;