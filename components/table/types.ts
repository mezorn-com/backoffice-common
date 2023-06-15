import type { ColumnDef } from '@tanstack/react-table';
import type { IRowActionButton } from '@/backoffice-common/hooks/useListPage';

export interface ITableState {
    page: number;
    pageSize: number;
    totalPage?: number;
}

export interface ITableProps {
    data: any[];
    columns: ColumnDef<any>[];
    onInteract: (state: ITableState) => void;
    rowActionButtons?: IRowActionButton[];
    rowActionButtonPosition?: 'left' | 'right';
    state: ITableState
}