import * as React from 'react';
import type { IFormField } from '@/backoffice-common/types/form';
import type { IFormMetaResponse, ItemAction, MetaType, SubResources } from '@/backoffice-common/types/api/meta';
import { getMeta, replacePathParameters } from '@/backoffice-common/utils';
import axios from 'axios';
import type { IResponse } from '@/backoffice-common/types/api';
import { useNavigate } from 'react-router-dom';
import ActionButton from '@/backoffice-common/components/common/action-button';
import { usePathParameter } from '@/backoffice-common/hooks/usePathParameter';

interface IConfig {
    apiRoute: string;
    id: string;
}

export interface IDetailPageState {
    title: string;
    details: IFormField[];
    values: Record<string, any>;
    subResources?: SubResources;
    actions?: Record<MetaType | string, ItemAction>;
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

    const navigate = useNavigate();
    const pathParameter = usePathParameter();

    React.useEffect(() => {
        const fetchData = async () => {
            void fetchDetails();
            const data = await getMeta<IFormMetaResponse>(apiRoute, 'get', { resourceId: id });
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

    const actionButtons: React.ReactNode = React.useMemo(() => {
        const buttonList: React.ReactNode[] = [];

        for (const subResourceKey in state.subResources) {
            const subResource = state.subResources[subResourceKey];
            if (subResource) {
                buttonList.push((
                    <ActionButton
                        key={subResourceKey}
                        actionKey={subResourceKey}
                        action={subResource}
                        onClick={() => {
                            navigate(replacePathParameters(subResourceKey, pathParameter))
                        }}
                        data={state.values}
                    />
                ))
            }
        }

        if (state.actions) {
            for (const actionKey in state.actions) {
                const action = state.actions[actionKey];
                if (action) {
                    buttonList.push(
                        <ActionButton
                            key={actionKey}
                            actionKey={actionKey}
                            action={action}
                            data={state.values}
                        />
                    )
                }
            }
        }

        return buttonList;
    }, [ state.actions, state.subResources, navigate, pathParameter, state.values ]);

    return {
        state,
        fetchDetails,
        actionButtons
    }
}

export default useDetailPage;