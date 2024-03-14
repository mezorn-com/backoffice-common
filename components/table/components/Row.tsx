import * as React from 'react';
import { ROW_UID_ATTR } from '../utils';
import { useForceUpdate } from '@mantine/hooks';
import { RowGroup } from '../types';
import classes from './Row.module.scss';
import { TableContext } from '../context';
import { clsx } from 'clsx';

interface TableRowProps {
    children: React.ReactNode;
    rowId: string;
    rowGroup: RowGroup;
    rowIndex: number;
}

const TableRow = ({
    children,
    rowId,
    rowGroup,
    rowIndex
}: TableRowProps) => {

    const rowRef = React.useRef<HTMLDivElement>(null);
    const forceUpdate = useForceUpdate();
    const { setRowHoverIndex, rowHoverIndex } = React.useContext(TableContext);

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
        <div
            {...customAttrs}
            className={clsx(
                classes.container,
                {
                    [classes.hover]: rowGroup === RowGroup.BODY && rowIndex === rowHoverIndex
                }
            )}
            ref={rowRef}
            onMouseEnter={() => {
                switch(rowGroup) {
                    case RowGroup.BODY: {
                        setRowHoverIndex(rowIndex);
                        break;
                    }
                    case RowGroup.HEADER:
                    case RowGroup.FOOTER: {
                        setRowHoverIndex(null);
                    }
                }
            }}
        >
            {renderCell()}
        </div>
    )
};

export default TableRow;