import * as React from 'react';
import axios from 'axios';
import type { IListResponse } from '@/backoffice-common/types/api';
import { formatColumns, getMeta, replacePathParameters } from '@/backoffice-common/utils';
import type { BulkAction, IListMetaResponse, } from '@/backoffice-common/types/api/meta';
import type { ColumnDef } from '@tanstack/react-table';
import type { IListState } from '@/backoffice-common/types/common/list';
import { produce } from 'immer';
import { useNavigate } from 'react-router-dom';
import type { ITableInteraction } from '@/backoffice-common/components/table/types';
import type { INormalField, IVisibility } from '@/backoffice-common/types/form';
import ActionButton, { ActionButtonProps } from '@/backoffice-common/components/common/action-button';

interface IConfig {
    apiRoute: string;
}

export type IRowActionButton = {
    onClick?: (record: Record<string, unknown>) => void;
    visibility?: IVisibility;
} &
    ({
        label(row: Record<string, unknown>): React.ReactNode;
    }
    |
    {
        label: React.ReactNode;
    })

type SetListResponse = {
    type: 'SET_LIST_RESPONSE',
    payload: {
        docs: Record<string, unknown>[];
        page: number;
        limit: number;
        totalPage: number;
        totalData?: number;
        listResponse?: Record<string, unknown>;
    };
};

type SetMetaData = {
    type: 'SET_META_DATA',
    payload: {
        columns: ColumnDef<Record<string, unknown>>[];
        pageTitle?: string;
        subResources?: IListMetaResponse['subResources'];
        listActions?: IListMetaResponse['listActions'];
        listItemActions?: IListMetaResponse['listItemActions'];
        filter?: INormalField[];
        bulkItemActions?: Record<string, BulkAction>;
    };
}

type HandleTableInteract = {
    type: 'HANDLE_TABLE_INTERACT',
    payload: ITableInteraction;
}

type HandleRowSelectChange = {
    type: 'HANDLE_ROW_SELECT_CHANGE',
    payload: string[];
}

export type Action =
    SetListResponse
    | SetMetaData
    | HandleTableInteract
    | HandleRowSelectChange
    ;

const initialState: IListState = {
    page: 1,
    pageSize: 20,
    totalPage: 1,
    totalData: undefined,
    docs: [],
    columns: [],
    subResources: undefined,
    pageTitle: undefined,
    listActions: undefined,
    listItemActions: undefined,
    filter: undefined,
    listResponse: undefined,
    bulkItemActions: undefined,
    selectedRows: [],
}

interface IBaseListParams {
    page: number;
    limit: number;
    filter?: Record<string, unknown>;
}

const reducer = produce(
    (draft: IListState, action: Action) => {
        switch(action.type) {
            case 'SET_LIST_RESPONSE': {
                draft.docs = action.payload.docs;
                draft.page = action.payload.page;
                draft.pageSize = action.payload.limit;
                draft.totalPage = action.payload.totalPage;
                draft.totalData = action.payload.totalData;
                draft.listResponse = action.payload.listResponse;
                break;
            }
            case 'SET_META_DATA': {
                draft.columns = action.payload.columns;
                draft.pageTitle = action.payload.pageTitle;
                draft.listActions = action.payload.listActions;
                draft.listItemActions = action.payload.listItemActions;
                draft.subResources = action.payload.subResources;
                draft.filter = action.payload.filter;
                draft.bulkItemActions = action.payload.bulkItemActions;
                break;
            }
            case 'HANDLE_TABLE_INTERACT': {
                const { payload } = action;
                draft.page = payload.state.page;
                draft.pageSize = payload.state.pageSize;
                draft.selectedRows = payload.selectedRows ?? [];
                break;
            }
            case 'HANDLE_ROW_SELECT_CHANGE': {
                draft.selectedRows = action.payload;
                break;
            }
            default:
                break;
        }
    }
);

const useListPage = ({
    apiRoute,
}: IConfig) => {

    const navigate = useNavigate();

    const [ state, dispatch ] = React.useReducer(reducer, initialState);

    React.useEffect(() => {
        const fetchColumns = async () => {
            const response = await getMeta<IListMetaResponse>(apiRoute, 'list');
            dispatch({
                type: 'SET_META_DATA',
                payload: {
                    columns: formatColumns(response?.form?.fields ?? []),
                    pageTitle: response.form.title,
                    listActions: response.listActions,
                    listItemActions: response.listItemActions,
                    subResources: response.subResources ?? [],
                    filter: response.filter,
                    bulkItemActions: response.bulkItemActions
                },
            })
        }
        void fetchColumns();
        void fetchData();
    }, []);

    const fetchData = async (params?: Partial<IBaseListParams>) => {
        const { data } = await axios.post<IListResponse>(`${apiRoute}/list`, params);

        dispatch({
            type: 'SET_LIST_RESPONSE',
            payload: {
                docs: data.data.docs,
                page: data.data.page,
                totalPage: data.data.totalPage,
                limit: data.data.limit,
                totalData: data.data.total,
                listResponse: data.data
            }
        })
    };

    const rowActionButtons = React.useMemo(() => {

        const rowActionButtonList: ActionButtonProps[] = [];

        for (const subResourceKey in state.subResources) {
            const subResource = state.subResources[subResourceKey];
            if (subResource) {
                rowActionButtonList.push({
                    action: {
                        condition: subResource.condition,
                        label: subResource.label,
                        icon: subResource.icon
                    },
                    actionKey: subResourceKey,
                    onClick(row) {
                        if (row) {
                            navigate(replacePathParameters(subResourceKey, row))
                        }
                    }
                })
            }
        }

        if (state.listItemActions) {
            for (const listItemActionKey in state.listItemActions) {
                const action = state.listItemActions[listItemActionKey];
                if (action) {
                    rowActionButtonList.push({
                        action,
                        actionKey: listItemActionKey,
                    })
                }
            }
        }
        return rowActionButtonList;
    }, [ state.subResources, state.listItemActions, navigate ]);

    const handleInteract = (payload: ITableInteraction) => {
        const { state: payloadState } = payload;
        dispatch({
            type: 'HANDLE_TABLE_INTERACT',
            payload: payload
        });
        void fetchData({
            page: payloadState.page,
            limit: payloadState.pageSize,
            filter: payload.filter
        })
    }

    const listActionButtons: React.ReactNode = React.useMemo(() => {
        const buttonList: React.ReactNode[] = [];

        if (state.listActions) {
            for (const listActionKey in state.listActions) {
                const listAction = state.listActions[listActionKey];
                if (listAction) {
                    buttonList.push(
                        <ActionButton
                            key={listActionKey}
                            actionKey={listActionKey}
                            action={listAction}
                            callback={fetchData}
                        />
                    )
                }
            }
        }

        return buttonList;
    }, [ state.listActions ]);

    return {
        state,
        dispatch,
        handleInteract,
        fetchData,
        rowActionButtons,
        listActionButtons
    }
}

export default useListPage;