import * as React from 'react';
import type { TableOptions, Column, TableInstance, Row } from 'react-table';
import { MouseEventHandler } from 'react';

// export interface ITableProps<T extends Record<string, unknown>> extends TableOptions<T> {
//     data: any[];
//     columns: Column[];
// }

export interface TableState {
    page: number;
    pageSize: number;
}

export interface ITableRowActionButton {
    label: React.ReactNode | ((row: Record<string, any>, table: TableInstance) => React.ReactNode);
    onClick?: (row: Record<string, any>, table: TableInstance) => void;
}

export interface ITableProps {
    data: any[];
    columns: Column[];
    onInteract: (state: TableState) => void;
    totalPage: number;
    rowActionButtons?: ITableRowActionButton[];
    rowActionButtonPosition?: 'left' | 'right';
    // state: TableState;
    // name: string
    // onAdd?: (instance: TableInstance<T>) => MouseEventHandler
    // onDelete?: (instance: TableInstance<T>) => MouseEventHandler
    // onEdit?: (instance: TableInstance<T>) => MouseEventHandler
    // onClick?: (row: Row<T>) => void
    // extraCommands?: any[];
    // onRefresh?: MouseEventHandler
    // initialState?: Partial<TableState<T>>
}