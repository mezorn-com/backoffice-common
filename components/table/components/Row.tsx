import * as React from 'react';
import { ROW_PREFIX } from '../utils';
import { createStyles } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import { useRowMutationObserver } from '@/backoffice-common/components/table/hooks';

interface TableRowProps {
    children: React.ReactNode;
    rowId: string;
}

const useStyles = createStyles(() => {
    return {
        container: {
            display: 'flex',
            alignItems: 'flex-end'
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
    useRowMutationObserver(rowRef);

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
        [ROW_PREFIX]: rowId
    }

    return (
        <div {...customAttrs} className={classes.container} ref={rowRef}>
            {renderCell()}
        </div>
    )
};

export default TableRow;