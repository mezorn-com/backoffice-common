import * as React from 'react';
import { IFormField } from '@/backoffice-common/types/form';
import { IFormMetaResponse, ISubResource } from '@/backoffice-common/types/api/meta';
import { getMeta } from '@/backoffice-common/utils';
import axios from 'axios';
import { IResponse } from '@/backoffice-common/types/api';

interface IConfig {
    apiRoute: string;
    id: string;
}

interface IDetailPageState {
    title: string;
    details: IFormField[];
    values: Record<string, any>;
    subResources: ISubResource[];
}

const useDetailPage = ({
    apiRoute,
    id
}: IConfig) => {

    const [ state, setState ] = React.useState<IDetailPageState>({
        title: '',
        details: [],
        subResources: [],
        values: {}
    });

    React.useEffect(() => {
        const fetchData = async () => {
            void fetchDetails();
            const data = await getMeta<IFormMetaResponse>(apiRoute, 'get');
            setState(prev => ({
                ...prev,
                details: data.form.fields,
                subResources: data.subResources ?? [],
                title: data.form.title ?? '',
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


    return {
        state,
        fetchDetails
    }
}

export default useDetailPage;