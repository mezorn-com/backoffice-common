import * as React from 'react';

export interface ITableContext {
    columnObservers: Record<string, ResizeObserver>,
}

export const TableContext = React.createContext<React.RefObject<ITableContext>>({ current: null });
