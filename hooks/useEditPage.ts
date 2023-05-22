import * as React from 'react';
import { IFormField } from '@/backoffice-common/types/form';
import { getMeta } from '@/backoffice-common/utils';
import { IFormMetaResponse } from '@/backoffice-common/types/api/meta';
import axios from 'axios';
import { IResponse } from '@/backoffice-common/types/api';
import { IFormValues } from '@/backoffice-common/components/form/helper';
import { showMessage } from '@/backoffice-common/lib/notification';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface IConfig {
    apiRoute: string;
    clientRoute: string;
    id: string;
}

interface IEditPageState {
    fields: IFormField[];
    values: Record<string, any>;
    title: string;
}

const useEditPage = ({
    apiRoute,
    clientRoute,
    id
}: IConfig) => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [ state, setState ] = React.useState<IEditPageState>({
        fields: [],
        values: {},
        title: ''
    })

    React.useEffect(() => {
        const fetchData = async () => {
            const data = await getMeta<IFormMetaResponse>(apiRoute, 'update');
            const { data: formValuesResponse } = await axios.get<IResponse<Record<string, any>>>(`${apiRoute}/${id}`);
            setState({
                title: data?.form?.title ?? '',
                values: formValuesResponse.data,
                fields: data?.form?.fields ?? []
            })
        }
        void fetchData();
    }, []);

    const submitHandler = async (values: IFormValues) => {
        const { data } = await axios.put<IResponse<any>>(`${apiRoute}/${id}`, values);
        if (data.success) {
            showMessage(t('success', { ns: 'common' }), 'green');
            navigate(clientRoute);
        } else {
            showMessage(t('error.title', { ns: 'common' }));
        }
    }

    return {
        state,
        submitHandler,
    }
}

export default useEditPage;
