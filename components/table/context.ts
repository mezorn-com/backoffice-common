import { createContext } from 'react';

interface TableContextData {
    columnObserver: ResizeObserver | null;
}

export const TableContext = createContext<TableContextData>({
    columnObserver: null
})