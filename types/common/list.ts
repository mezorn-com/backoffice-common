import type { ColumnDef } from '@tanstack/react-table';
import type { IListMetaResponse } from '../api/meta';
import type { ITableState } from '@/backoffice-common/components/table/types';
import { INormalField } from '@/backoffice-common/types/form';

export interface IListState extends ITableState {
    docs: Record<string, unknown>[];
    pageTitle?: string;
    columns: ColumnDef<Record<string, any>>[];
    subResources?: IListMetaResponse['subResources'];
    listActions?: IListMetaResponse['listActions'];
    listItemActions?: IListMetaResponse['listItemActions'];
    filter?: INormalField[];
}