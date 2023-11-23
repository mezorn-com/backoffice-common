import * as React from 'react';
import axios from 'axios';
import { IListResponse, IResponse } from '@/backoffice-common/types/api';
import { formatColumns, getMeta, replacePathParameters } from '@/backoffice-common/utils';
import {
    BulkAction,
    IListMetaResponse,
    ListAction,
    ListActionKey,
    ListItemAction,
    ListItemActionKey,
} from '@/backoffice-common/types/api/meta';
import type { ColumnDef } from '@tanstack/react-table';
import type { IListState } from '@/backoffice-common/types/common/list';
import { produce } from 'immer';
import { Button, useMantineTheme } from '@mantine/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconEdit, IconEye, IconTrash, IconFilePlus } from '@tabler/icons-react';
import { showMessage } from '@/backoffice-common/lib/notification';
import { useTranslation } from 'react-i18next';
import type { ITableInteraction } from '@/backoffice-common/components/table/types';
import type { INormalField, IVisibility } from '@/backoffice-common/types/form';
import { actionColors } from '@/backoffice-common/utils/styles';
import { useConfirmModal, usePathParameter } from '@/backoffice-common/hooks';

type IRowActionButtonKey = 'update' | 'delete' | 'get';

interface IConfig {
    apiRoute: string;
    rowActionButtons?: IRowActionButtonKey[];
}

export type IRowActionButton = {
    onClick?: (record: Record<string, any>) => void;
    visibility?: IVisibility;
} &
    ({
        label(row: Record<string, any>): React.ReactNode;
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
        columns: ColumnDef<Record<string, any>>[];
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

type UpdateActiveListAction = {
    type: 'UPDATE_ACTIVE_LIST_ACTION',
    payload?: {
        action: ListAction;
        key: string;
    };
}

type UpdateListActionFormValue = {
    type: 'UPDATE_LIST_ACTION_FORM_VALUE',
    payload: Record<string, unknown>;
}

type HandleActionComplete = {
    type: 'HANDLE_ACTION_COMPLETE'
}

export type Action =
    SetListResponse
    | SetMetaData
    | HandleTableInteract
    | HandleRowSelectChange
    | UpdateActiveListAction
    | UpdateListActionFormValue
    | HandleActionComplete
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
    activeListAction: undefined,
    listActionValues: undefined
}

interface IBaseListParams {
    page: number;
    limit: number;
    filter?: Record<string, any>;
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
            case 'UPDATE_ACTIVE_LIST_ACTION': {
                if (action.payload) {
                    draft.activeListAction = {
                        action: action.payload?.action,
                        key: action.payload?.key
                    }
                } else {
                    draft.activeListAction = undefined;
                }
                break;
            }
            case 'UPDATE_LIST_ACTION_FORM_VALUE': {
                if (action.payload) {
                    draft.listActionValues = action.payload
                }
                break;
            }
            case 'HANDLE_ACTION_COMPLETE': {
                draft.activeListAction = undefined;
                draft.listActionValues = undefined;
                break;
            }
            default:
                break;
        }
    }
);

const ACTION_ICON_SIZE = 16;

const useListPage = ({
    apiRoute,
}: IConfig) => {

    const theme = useMantineTheme();

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const confirmModal = useConfirmModal();
    const pathParameter = usePathParameter();

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
                totalData: data.data.totalData,
                listResponse: data.data
            }
        })
    };

    const getRowActionButton = (key: ListItemActionKey, action: ListItemAction): IRowActionButton => {
        const actionColor = actionColors?.[key] || 'blue';
        const primaryShade: number = typeof theme.primaryShade !== 'number' ? theme.primaryShade.light : theme.primaryShade;

        const color = theme.colors[actionColor][primaryShade];
        let icon: React.ReactNode = null;
        let label: React.ReactNode;
        let actionFn: undefined | ((record: Record<string, any>) => void);
        switch(key) {
            case 'update': {
                label = 'Засах';
                icon = <IconEdit size={ACTION_ICON_SIZE} color={color}/>;

                actionFn = (record: Record<string, any>) => {
                    let editPath: string;
                    const { _id } = record;
                    if (pathname.endsWith('/')) {
                        editPath = `${pathname}${_id}/edit`;
                    } else {
                        editPath = `${pathname}/${_id}/edit`;
                    }
                    navigate(editPath);
                }
                break;
            }
            case 'delete': {
                label = 'Устгах';
                icon = <IconTrash size={ACTION_ICON_SIZE} color={color}/>;

                actionFn = (record: Record<string, any>) => {
                    confirmModal({
                        async onConfirm() {
                            const { data } = await axios.delete<IResponse<any>>(`${apiRoute}/${record._id}`);
                            if (data.success) {
                                showMessage(t('success', { ns: 'common' }), 'green');
                                void fetchData();
                            }
                        }
                    })
                }
                break;
            }
            case 'get': {
                label = 'Харах';
                icon = <IconEye size={ACTION_ICON_SIZE} color={color}/>;
                actionFn = (record: Record<string, any>) => {
                    let detailPath: string;
                    const { _id } = record;
                    if (pathname.endsWith('/')) {
                        detailPath = `${pathname}${_id}`
                    } else {
                        detailPath = `${pathname}/${_id}`
                    }
                    navigate(detailPath);
                }
                break;
            }
            default: {
                label = action === true ? undefined : action.label;
                if (action !== true && action.api) {
                    actionFn = async (record: Record<string, any>) => {
                        const onConfirm = async () => {
                            const { data } = await axios<IResponse<any>>({
                                url: replacePathParameters(action.api?.uri ?? '', { ...pathParameter, ...record }),
                                method: action.api?.method
                            });
                            if (data.success) {
                                showMessage(t('success', { ns: 'common' }), 'green');
                                void fetchData();
                            }
                        }
                        if (action.confirmation) {
                            confirmModal({
                                title: '',
                                children: action.confirmation.dialogText,
                                labels: {
                                    confirm: action.confirmation.buttonText,
                                    cancel: t('cancel', { ns: 'common' })
                                },
                                confirmProps: {
                                    color: 'blue',
                                },
                                onConfirm
                            })
                        } else {
                            void onConfirm();
                        }
                    }
                }
                break;
            }
        }

        let labelElement: React.ReactNode = (
            <Button
                fullWidth
                compact
                variant={'light'}
                leftIcon={icon}
            >
                {label}
            </Button>
        )
        if (!label) {
            labelElement = icon ?? '';
        }

        return {
            label: labelElement,
            onClick: (record: Record<string, any>) => {
                if (typeof actionFn === 'function') {
                    actionFn(record);
                } else {
                    if (action !== true) {
                        if (action.confirmation) {
                            confirmModal({
                                title: '',
                                children: action.confirmation.dialogText,
                                labels: {
                                    confirm: action.confirmation.buttonText ?? 'confirm',
                                    cancel: t('cancel', { ns: 'common' })
                                },
                                confirmProps: {
                                    color: key === 'delete' ? 'red' : undefined,
                                },
                                async onConfirm() {
                                    typeof actionFn === 'function' && actionFn(record);
                                    actionFn = undefined;
                                }
                            })
                        }
                    }
                }
            },
            visibility: action === true ? undefined : action?.condition,
        }
    }

    const rowActionButtons = React.useMemo(() => {

        const rowActionButtonList: IRowActionButton[] = [];

        for (const subResourceKey in state.subResources) {
            const subResource = state.subResources[subResourceKey];
            if (subResource) {
                rowActionButtonList.push({
                    label(row: Record<string, any>) {
                        return (
                            <Button
                                fullWidth
                                compact
                                component={Link}
                                to={replacePathParameters(subResourceKey, row)}
                                radius={'sm'}
                                variant={'light'}
                            >
                                {subResource.label}
                            </Button>
                        )
                    },
                    visibility: subResource.condition
                })
            }
        }

        if (state.listItemActions) {
            for (const listItemActionKey in state.listItemActions) {
                const action = state.listItemActions[listItemActionKey];
                if (action) {
                    rowActionButtonList.push(getRowActionButton(listItemActionKey, action))
                }
            }
        }
        return rowActionButtonList;
    }, [ state.subResources, state.listItemActions ]);

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

    React.useEffect(() => {
        if (state.listActionValues && state.activeListAction) {
            const submit = async () => {
                if (state.activeListAction?.action !== true) {
                    const { data } = await axios<IResponse<unknown>>({
                        url: replacePathParameters(state.activeListAction?.action.api?.uri ?? '', pathParameter),
                        method: state.activeListAction?.action.api?.method,
                        data: state.listActionValues
                    });
                    if (data.success) {
                        dispatch({ type: 'HANDLE_ACTION_COMPLETE' })
                        void fetchData()
                    }
                }
            }
            void submit();
        }
    }, [state.listActionValues]);

    const getListAction = (key: ListActionKey, action: ListAction): React.ReactNode => {
        let icon: React.ReactNode;
        let label: React.ReactNode;
        let actionFn: undefined | (() => void);
        switch(key) {
            case 'create': {
                icon = <IconFilePlus size={16}/>;
                label = t('create', { ns: 'common' });
                actionFn = () => {
                    navigate(pathname + '/new');
                }
                break;
            }
            default: {
                // icon = logic to get icon
                label = action === true ? undefined : action.label;
                if (action !== true && action.api) {
                    actionFn = async () => {

                        const onConfirm = async () => {
                            const { data } = await axios<IResponse<any>>({
                                url: action.api?.uri,
                                method: action.api?.method
                            });
                            if (data.success) {
                                showMessage(t('success', { ns: 'common' }), 'green');
                                void fetchData();
                            }
                        }
                        if (action.confirmation) {
                            confirmModal({
                                title: '',
                                children: action.confirmation.dialogText,
                                labels: {
                                    confirm: action.confirmation.buttonText,
                                    cancel: t('cancel', { ns: 'common' })
                                },
                                confirmProps: {
                                    color: 'blue',
                                },
                                onConfirm
                            })
                        } else {
                            void onConfirm();
                        }
                    }
                }
                break;
            }
        }
        return (
            <Button
                key={key}
                radius={'md'}
                leftIcon={icon}
                onClick={() => {
                    if (action !== true && action.api) {
                        dispatch({
                            type: 'UPDATE_ACTIVE_LIST_ACTION',
                            payload: {
                                action,
                                key
                            }
                        })
                        // modals.open({
                        //     title: 'Subscribe to newsletter',
                        //     children: (
                        //         <>
                        //             <Form
                        //                 fields={action.api.form.fields}
                        //                 onSubmit={(values) => {
                        //                     console.log('submit>>>', values);
                        //                 }}
                        //             />
                        //         </>
                        //     ),
                        // })
                    }


                    // if (typeof actionFn === 'function') {
                    //     actionFn();
                    // } else {
                    //     if (action !== true) {
                    //         if (action.confirmation) {
                    //             confirmModal({
                    //                 title: '',
                    //                 children: action.confirmation.dialogText,
                    //                 labels: {
                    //                     confirm: action.confirmation.buttonText ?? 'confirm',
                    //                     cancel: t('cancel', { ns: 'common' })
                    //                 },
                    //                 async onConfirm() {
                    //                     typeof actionFn === 'function' && actionFn();
                    //                     actionFn = undefined;
                    //                 }
                    //             })
                    //         }
                    //     }
                    // }
                }}
            >
                {label}
            </Button>
        );
    }

    const listActionButtons: React.ReactNode = React.useMemo(() => {
        const buttonList: React.ReactNode[] = [];

        if (state.listActions) {
            for (const listActionKey in state.listActions) {
                const listAction = state.listActions[listActionKey];
                if (listAction) {
                    buttonList.push(getListAction(listActionKey, listAction))
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