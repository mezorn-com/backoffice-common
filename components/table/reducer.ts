import { produce } from 'immer';
import { BulkAction } from '@/backoffice-common/types/api/meta.ts';

interface ITableState {
    filter: Record<string, unknown>;
    selectedBulkAction?: BulkAction;
}

type FilterItemChange = {
    type: 'HANDLE_FILTER_ITEM_CHANGE',
    payload: Record<string, unknown>;
};

type UpdateBulkAction = {
    type: 'UPDATE_BULK_ACTION',
    payload?: BulkAction;
}

export type Action =
    FilterItemChange
    | UpdateBulkAction
    ;

export const initialState: ITableState = {
    filter: {}
}

export const reducer = produce(
    (draft: ITableState, action: Action) => {
        switch(action.type) {
            case 'HANDLE_FILTER_ITEM_CHANGE': {
                draft.filter = {
                    ...action.payload
                };
                break;
            }
            case 'UPDATE_BULK_ACTION': {
                draft.selectedBulkAction = action.payload;
                break;
            }
            default:
                break;
        }
    }
);