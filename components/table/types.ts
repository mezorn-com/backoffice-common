import type { ReactNode } from 'react';
import type { Action, IRowActionButton } from '@/backoffice-common/hooks/useListPage';
import { IListState } from '@/backoffice-common/types/common/list';
import { Dispatch } from 'react';
import { ActionButtonProps } from '@/backoffice-common/components/common/action-button';

export interface ITableState {
    page: number;
    pageSize: number;
    totalPage?: number;
    total?: number;
}

export interface ITableInteraction {
    state: ITableState;
    filter?: Record<string, any>;
    selectedRows?: string[];
}

export interface ITableProps {
    onInteract: (state: ITableInteraction) => void;
    rowActionButtons?: ActionButtonProps[];
    state: IListState;
    pageSizes?: number[];
    dispatch: Dispatch<Action>;
    hideBulkActions?: boolean;
    bulkActionUrlParser?: (url: string) => string;
}

export enum TableSectionType {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right'
}

export enum RowGroup {
    HEADER = 'header',
    BODY = 'body',
    FOOTER = 'footer',
}