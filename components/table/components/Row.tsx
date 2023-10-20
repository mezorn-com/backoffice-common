import * as React from 'react';
import { ROW_PREFIX } from '../utilts';
import { createStyles } from '@mantine/core';

interface TableRowProps {
    children: React.ReactNode;
    rowId: string;
}

const useStyles = createStyles(() => {
    return {
        container: {
            display: 'flex'
        }
    }
})

const TableRow = ({
    children,
    rowId,
}: TableRowProps) => {

    const { classes } = useStyles();

    const customAttrs = {
        [ROW_PREFIX]: rowId
    }

    return (
        <div className={classes.container} {...customAttrs}>
            {children}
        </div>
    )
};

export default TableRow;