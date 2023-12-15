import * as React from 'react';
import { ROW_UID_ATTR } from '../utils';
import { useForceUpdate } from '@mantine/hooks';
import { RowGroup } from '../types';
import classes from './Row.module.scss';

interface TableRowProps {
    children: React.ReactNode;
    rowId: string;
    rowGroup: RowGroup;
}

const TableRow = ({
    children,
    rowId,
    rowGroup
}: TableRowProps) => {

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
    // TODO: hover deerh background color iig yanzlah
    // background-color: rowGroup !== RowGroup.HEADER ? theme.colors.gray[0] : 'transparent'

    return (
        <div {...customAttrs} className={classes.container} ref={rowRef}>
            {renderCell()}
        </div>
    )
};

export default TableRow;