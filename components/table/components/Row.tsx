import * as React from 'react';
import { ROW_UID_ATTR } from '../utils';
import { createStyles } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';

interface TableRowProps {
    children: React.ReactNode;
    rowId: string;
}

const useStyles = createStyles(() => {
    return {
        container: {
            display: 'flex',
            alignItems: 'flex-end',
            height: 'fit-content',
        }
    }
})

const TableRow = ({
    children,
    rowId,
}: TableRowProps) => {

    const { classes } = useStyles();
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