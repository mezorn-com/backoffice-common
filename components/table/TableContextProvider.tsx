import * as React from 'react';
import { TableContext, ITableContext } from '././context';

interface TableContextProviderProps {
    children?: React.ReactNode;
}

const TableContextProvider = ({
    children
}: TableContextProviderProps) => {

    const ref = React.useRef<ITableContext>({
        columnObservers: {},
    })

    return (
        <TableContext.Provider value={ref}>
            {children}
        </TableContext.Provider>
    )
}

export default TableContextProvider;