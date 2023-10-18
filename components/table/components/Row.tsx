import * as React from 'react';

interface TableRowProps {
    children: React.ReactNode;
}

const TableRow = ({
    children,
}: TableRowProps) => {
    return (
        <div style={{ display: 'flex' }}>
            {children}
        </div>
    )
};

export default TableRow;