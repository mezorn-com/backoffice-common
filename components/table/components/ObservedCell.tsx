import * as React from 'react';
import { TableContext } from '../context.ts';

interface ObservedCellProps {
    children?: React.ReactNode;
    attrs: any;
}

const ObservedCell = ({
    children,
    attrs
}: ObservedCellProps) => {
    const { columnObserver } = React.useContext(TableContext);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (columnObserver && ref.current) {
            columnObserver.observe(ref.current)
        }
    }, [ columnObserver ]);

    return (
        <div
            {...attrs}
            ref={ref}
            style={{
                wordBreak: 'keep-all',
                whiteSpace: 'nowrap',
                padding: '.3rem .5rem'
            }}
        >
            {children}
        </div>
    )
}

export default ObservedCell;