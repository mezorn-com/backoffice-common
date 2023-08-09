import type { ColumnDef } from '@tanstack/react-table';
import type { IActionMeta, ISubResource, MetaType } from '../api/meta';
import type { ITableState } from '@/backoffice-common/components/table/types';
import { INormalField, IVisibility } from '@/backoffice-common/types/form';

export interface IListState extends ITableState {
    docs: Record<string, unknown>[];
    pageTitle?: string;
    columns: ColumnDef<Record<string, any>>[];
    subResources: ISubResource[];
    listActions: MetaType[];
    itemActions?: Record<MetaType, IVisibility>;
    itemSubResources?: Record<string, IVisibility>;
    actionMetas?: Record<string, IActionMeta>;
    filter?: INormalField[];
}