import type { ColumnDef } from '@tanstack/react-table';
import type { BulkAction, Form, IListMetaResponse, ListAction } from '../api/meta';
import type { ITableState } from '@/backoffice-common/components/table/types';
import { INormalField } from '@/backoffice-common/types/form';

export type ListDoc = Record<string, unknown>;

export interface IListState extends ITableState {
    docs: ListDoc[];
    pageTitle?: string;
    columns: ColumnDef<Record<string, any>>[];
    subResources?: IListMetaResponse['subResources'];
    listActions?: IListMetaResponse['listActions'];
    listItemActions?: IListMetaResponse['listItemActions'];
    filter?: INormalField[];
    listResponse?: Record<string, unknown>;
    bulkItemActions?: Record<string, BulkAction>;
    selectedRows: string[];
    activeListAction?: {
        action: ListAction;
        key: string;
    };
    listActionValues?: Record<string, unknown>;
}