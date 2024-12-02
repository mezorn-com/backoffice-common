import '@tanstack/react-table';
import type { RenderField } from '@/backoffice-common/types/form';
import type { RowData } from '@tanstack/react-table';

declare module '@tanstack/table-core' {
	interface ColumnMeta<TData extends RowData, TValue> {
		field: RenderField;
	}
}
