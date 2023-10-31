import '@tanstack/react-table'
import { RenderField } from '@/backoffice-common/types/form';

declare module '@tanstack/table-core' {
    interface ColumnMeta<TData extends RowData, TValue> {
        field: RenderField;
    }
}