import '@tanstack/react-table';

// eslint-disable-next-line no-duplicate-imports
import type { RowData } from '@tanstack/react-table';

import type { RenderField } from '@/backoffice-common/types/form';

declare module '@tanstack/table-core' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		field: RenderField;
	}
}
