import { produce } from 'immer';

interface ITableState {
    filter: Record<string, unknown>;
}

type SetListResponse = {
    type: 'HANDLE_FILTER_ITEM_CHANGE',
    payload: Record<string, unknown>;
};

export type Action =
    SetListResponse
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
            default:
                break;
        }
    }
);