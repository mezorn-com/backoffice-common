import type { Action, IRowActionButton } from '@/backoffice-common/hooks/useListPage';
import { IListState } from '@/backoffice-common/types/common/list';
import { Dispatch } from 'react';

export interface ITableState {
    page: number;
    pageSize: number;
    totalPage?: number;
    totalData?: number;
}

export interface ITableInteraction {
    state: ITableState;
    filter?: Record<string, any>;
    selectedRows?: string[];
}

export interface ITableProps {
    onInteract: (state: ITableInteraction) => void;
    rowActionButtons?: IRowActionButton[];
    rowActionButtonPosition?: 'left' | 'right';
    state: IListState;
    pageSizes?: number[];
    dispatch?: Dispatch<Action>;
}

export enum TableSectionType {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right'
}