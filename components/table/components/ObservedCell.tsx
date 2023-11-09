import * as React from 'react';
import { TableContext } from '../context';
import { createStyles } from '@mantine/core';

const useStyles = createStyles(() => {
    return {
        container: {
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap'
        },
        cell: {
            width: 'min-content',
            padding: '.3rem .5rem'
        }
    }
})

interface ObservedCellProps {
    children?: React.ReactNode;
    attrs: any;
}

const ObservedCell = ({
    children,
    attrs
}: ObservedCellProps) => {
    const { classes } = useStyles();
    const { columnObserver } = React.useContext(TableContext);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (columnObserver && ref.current) {
            columnObserver.observe(ref.current)
        }
    }, [ columnObserver ]);

    return (
        <div {...attrs} className={classes.container}>
            <div
                {...attrs}
                ref={ref}
                className={classes.cell}
            >
                {children}
            </div>
        </div>
    )
}

export default ObservedCell;