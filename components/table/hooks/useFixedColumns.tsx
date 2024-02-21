import { type ColumnDef, createColumnHelper, type Row } from '@tanstack/react-table';
import RowActionButtons from '../components/row-action-buttons';
import type { ActionButtonProps } from '@/backoffice-common/components/common/action-button';
import type { ListDoc } from '@/backoffice-common/types/common/list';

export const useFixedColumns = (rowActionButtons: ActionButtonProps[], callback: () => void): ColumnDef<ListDoc>[] => {
	const columnHelper = createColumnHelper<ListDoc>();

	if (rowActionButtons) {
		return [
			columnHelper.display({
				id: 'table-actions-column',
				cell(props) {
					return (
						<RowActionButtons
							buttons={rowActionButtons}
							row={props.row}
							callback={callback}
						/>
					)
				},
			})
		]
	}

	return [];
};