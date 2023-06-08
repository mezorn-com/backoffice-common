import * as React from 'react';
import axios from 'axios';
import { IListResponse, IResponse } from '@/backoffice-common/types/api';
import { formatColumns, getMeta } from '@/backoffice-common/utils';
import { IListMetaResponse, ISubResource } from '@/backoffice-common/types/api/meta';
import { Column } from 'react-table';
import { IListState } from '@/backoffice-common/types/common/list';
import { produce } from 'immer';
import { ActionIcon, Button } from '@mantine/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSubResourceUrl } from '@/backoffice-common/utils/route';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { openConfirmModal } from '@mantine/modals';
import { showMessage } from '@/backoffice-common/lib/notification';
import { useTranslation } from 'react-i18next';

type IRowActionButtonKey = 'edit' | 'delete' | 'detail';

interface IConfig {
    apiRoute: string;
    rowActionButtons?: IRowActionButtonKey[];
}

type IRowActionButtons = ({label(row: Record<string, any>): React.ReactNode} | {label: React.ReactNode, onClick: (record: Record<string, any>) => void})[]

type SetListResponse = {
    type: 'SET_LIST_RESPONSE',
    payload: {
        docs: Record<string, unknown>[];
        page: number;
        limit: number;
        totalPage: number;
    };
};

type SetMetaData = {
    type: 'SET_META_DATA',
    payload: {
        columns: Column<Record<string, any>>[];
        subResources: ISubResource[];
        pageTitle?: string;
    };
}

export type Action =
    SetListResponse |
    SetMetaData
    ;

const initialState: IListState = {
    page: 1,
    limit: 20,
    totalPage: 1,
    docs: [],
    columns: [],
    subResources: [],
    pageTitle: undefined,
}

const reducer = produce(
    (draft: IListState, action: Action) => {
        switch(action.type) {
            case 'SET_LIST_RESPONSE': {
                draft.docs = action.payload.docs;
                draft.page = action.payload.page;
                draft.limit = action.payload.limit;
                draft.totalPage = action.payload.totalPage;
                break;
            }
            case 'SET_META_DATA': {
                draft.columns = action.payload.columns;
                draft.subResources = action.payload.subResources;
                draft.pageTitle = action.payload.pageTitle;
                break;
            }
            default:
                break;
        }
    }
);

const useListPage = ({
    apiRoute,
    rowActionButtons = ['edit', 'delete', 'detail']
}: IConfig) => {

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useTranslation();

    const [ state, dispatch ] = React.useReducer(reducer, initialState);

    React.useEffect(() => {
        const fetchColumns = async () => {
            const response = await getMeta<IListMetaResponse>(apiRoute, 'list');
            dispatch({
                type: 'SET_META_DATA',
                payload: {
                    columns: formatColumns(response.form.fields),
                    subResources: response.subResources ?? [],
                    pageTitle: response.form.title
                },
            })
        }
        void fetchColumns();
        void fetchData();
    }, []);

    const fetchData = async (params?: Record<string, any>) => {
        const { data } = await axios.post<IListResponse>(`${apiRoute}/list`, params);

        dispatch({
            type: 'SET_LIST_RESPONSE',
            payload: {
                docs: data.data.docs,
                page: data.data.page,
                totalPage: data.data.totalPage,
                limit: data.data.limit
            }
        })
    };

    const baseRowActionButtons = React.useMemo(() => {

        const rowActionButtonList: IRowActionButtons = state.subResources.map((subResource) => {
            return {
                label(row: Record<string, any>) {
                    return (
                        <Button
                            compact
                            component={Link}
                            to={getSubResourceUrl(subResource.resource, [
                                { match: '{_id}', replace: row._id },
                            ])}
                            radius={'sm'}
                            variant={'light'}
                        >
                            {subResource.label}
                        </Button>
                    )
                }
            }
        });

        if (rowActionButtons?.includes('edit')) {
            rowActionButtonList.push({
                label: (
                    <ActionIcon variant="light" color={'primary'}>
                        <IconEdit size={18}/>
                    </ActionIcon>
                ),
                onClick: (record: Record<string, any>) => {
                    navigate(`${pathname}/${record._id}/edit`)
                }
            })
        }

        if (rowActionButtons?.includes('delete')) {
            rowActionButtonList.push({
                label: (
                    <ActionIcon variant="light" color={'red'}>
                        <IconTrash size={18}/>
                    </ActionIcon>
                ),
                onClick: (record: Record<string, any>) => {
                    openConfirmModal({
                        title: t('delete.modalTitle', { ns: 'common' }),
                        children: t('delete.description', { ns: 'common' }),
                        labels: {
                            confirm: t('delete.title', { ns: 'common' }),
                            cancel: t('cancel', { ns: 'common' })
                        },
                        confirmProps: {
                            color: 'red',
                        },
                        async onConfirm() {
                            const { data } = await axios.delete<IResponse<any>>(`${apiRoute}/${record._id}`);
                            if (data.success) {
                                showMessage(t('success', { ns: 'common' }), 'green');
                                void fetchData();
                            }
                        }
                    })
                }
            })
        }

        if (rowActionButtons?.includes('detail')) {
            rowActionButtonList.push({
                label: (
                    <ActionIcon variant="light" color={'primary'}>
                        <IconEye size={18}/>
                    </ActionIcon>
                ),
                onClick: (record: Record<string, any>) => {
                    navigate(`${pathname}/${record._id}`)
                }
            })
        }

        return rowActionButtonList;
    }, [ rowActionButtons ])

    return {
        state,
        dispatch,
        fetchData,
        baseRowActionButtons
    }
}

export default useListPage;