import { Column } from 'react-table';
import type { ISubResource } from '../api/meta';

export interface IListState {
    page: number;
    limit: number;
    totalPage: number;
    docs: Record<string, unknown>[];
    pageTitle?: string;
    columns: Column[];
    subResources: ISubResource[];
}