import { createContext } from 'react';

interface TableContextData {
    columnObserver: ResizeObserver | null;
    rowHoverIndex: null | number;
    setRowHoverIndex: (value: number | null) => void;
}

export const TableContext = createContext<TableContextData>({
    columnObserver: null,
    rowHoverIndex: null,
    setRowHoverIndex: () => {},
})