import * as React from 'react';
import { IFormField } from '@/backoffice-common/types/form';
import {
    IFormMetaResponse,
    ListAction,
    ListActionKey,
    MetaType,
    SubResources
} from '@/backoffice-common/types/api/meta';
import { getMeta } from '@/backoffice-common/utils';
import axios from 'axios';
import { IResponse } from '@/backoffice-common/types/api';
import { Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { showMessage } from '@/backoffice-common/lib/notification';
import { openConfirmModal } from '@mantine/modals';
import { useTranslation } from 'react-i18next';
import { last } from 'ramda';

interface IConfig {
    apiRoute: string;
    id: string;
}

export interface IDetailPageState {
    title: string;
    details: IFormField[];
    values: Record<string, any>;
    subResources?: SubResources;
    actions?: Record<MetaType | string, ListAction>;
}

const useDetailPage = ({
    apiRoute,
    id
}: IConfig) => {

    const [ state, setState ] = React.useState<IDetailPageState>({
        title: '',
        details: [],
        subResources: undefined,
        values: {},
        actions: undefined,
    });

    const { t } = useTranslation();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            void fetchDetails();
            const data = await getMeta<IFormMetaResponse>(apiRoute, 'get', { resourceId: id });
            // console.log('data>>>>', data);
            setState(prev => ({
                ...prev,
                details: data.form.fields,
                subResources: data.subResources,
                title: data.form.title ?? '',
                actions: data.actions,
            }))
        };
        void fetchData();
    }, []);

    const fetchDetails = async () => {
        const { data: formValuesResponse } = await axios.get<IResponse<Record<string, any>>>(`${apiRoute}/${id}`);
        setState(prev => ({
            ...prev,
            values: formValuesResponse.data
        }))
    }

    const getAction = (key: ListActionKey, action: ListAction): React.ReactNode => {
        let icon: React.ReactNode;
        let label: React.ReactNode = action === true ? undefined : action.label;
        let actionFn: undefined | (() => void);
        switch(key) {
            case 'update': {
                icon = <IconEdit size={18}/>;

                actionFn = () => {
                    let editPath: string;
                    if (pathname.endsWith('/')) {
                        editPath = `${pathname}edit`;
                    } else {
                        editPath = `${pathname}/edit`;
                    }
                    navigate(editPath);
                }
                break;
            }
            case 'delete': {
                icon = <IconTrash size={18}/>;

                actionFn = () => {
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
                            const id = last(pathname.split('/'));
                            const { data } = await axios.delete<IResponse<any>>(`${apiRoute}/${id}`);
                            if (data.success) {
                                showMessage(t('success', { ns: 'common' }), 'green');
                                // void fetchData();
                            }
                        }
                    })
                }
                break;
            }
        }

        if (action !== true && action.api) {
            actionFn = async () => {
                const { data } = await axios<IResponse<any>>({
                    url: action.api?.uri,
                    method: action.api?.method
                });
                if (data.success) {
                    showMessage(t('success', { ns: 'common' }), 'green');
                    // void fetchData();
                }
            }
        }

        return (
            <Button
                key={key}
                radius={'md'}
                leftIcon={icon}
                onClick={() => {
                    if (typeof actionFn === 'function') {
                        actionFn();
                    } else {
                        if (action !== true) {
                            if (action.confirmation) {
                                openConfirmModal({
                                    title: '',
                                    children: action.confirmation.dialogText,
                                    labels: {
                                        confirm: action.confirmation.buttonText ?? 'confirm',
                                        cancel: t('cancel', { ns: 'common' })
                                    },
                                    async onConfirm() {
                                        typeof actionFn === 'function' && actionFn();
                                        actionFn = undefined;
                                    }
                                })
                            }
                        }
                    }
                }}
            >
                {label}
            </Button>
        );
    }

    const actionButtons = React.useMemo(() => {
        const buttonList: React.ReactNode[] = [];

        if (state.actions) {
            for (const actionKey in state.actions) {
                const action = state.actions[actionKey];
                if (action) {
                    buttonList.push(getAction(actionKey, action))
                }
            }
        }
        return buttonList as React.ReactNode;
    }, [ state.actions ]);


    return {
        state,
        fetchDetails,
        actionButtons
    }
}

export default useDetailPage;