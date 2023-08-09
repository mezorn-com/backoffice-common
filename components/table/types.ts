import type { ColumnDef } from '@tanstack/react-table';
import type { IRowActionButton } from '@/backoffice-common/hooks/useListPage';
import { IListState } from '@/backoffice-common/types/common/list';

export interface ITableState {
    page: number;
    pageSize: number;
    totalPage?: number;
}

export interface ITableInteraction {
    state: ITableState;
    filter?: Record<string, any>;
}

export interface ITableProps {
    onInteract: (state: ITableInteraction) => void;
    rowActionButtons?: IRowActionButton[];
    rowActionButtonPosition?: 'left' | 'right';
    state: IListState;
}