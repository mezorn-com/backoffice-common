import * as React from 'react';
import { TableContext } from '../context';

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
            style={{
                wordBreak: 'keep-all',
                whiteSpace: 'nowrap',
            }}
        >
            <div
                {...attrs}
                style={{
                width: 'min-content',
                padding: '.3rem .5rem'
            }}
                 ref={ref}
            >
                {children}
            </div>
        </div>
    )
}

export default ObservedCell;