import type { ColumnDef, TableState } from '@tanstack/react-table';
import type { ISubResource } from '../api/meta';
import type { ITableState } from '@/backoffice-common/components/table/types';

export interface IListState extends ITableState {
    docs: Record<string, unknown>[];
    pageTitle?: string;
    columns: ColumnDef<Record<string, any>>[];
    subResources: ISubResource[];
}