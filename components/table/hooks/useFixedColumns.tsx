import type { ActionButtonProps } from '@/backoffice-common/components/common/action-button';
import type { ListDoc } from '@/backoffice-common/types/common/list';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import RowActionButtons from '../components/row-action-buttons';

const columnHelper = createColumnHelper<ListDoc>();

export const useFixedColumns = (
	rowActionButtons: ActionButtonProps[]
): ColumnDef<ListDoc>[] => {
	return useMemo(() => {
		if (rowActionButtons) {
			return [
				columnHelper.display({
					id: 'table-actions-column',
					cell(props) {
						return (
							<RowActionButtons
								buttons={rowActionButtons}
								row={props.row}
							/>
						);
					}
				})
			];
		}

		return [];
	}, [rowActionButtons]);
};
