import * as React from 'react';
import { IFormField } from '@/backoffice-common/types/form';
import { getMeta } from '@/backoffice-common/utils';
import { IFormMetaResponse } from '@/backoffice-common/types/api/meta';
import { IFormValues } from '@/backoffice-common/components/form/helper';
import axios from 'axios';
import { IFormSubmitResponse, IResponse } from '@/backoffice-common/types/api';
import { showMessage } from '@/backoffice-common/lib/notification';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fetchReference from '@/backoffice-common/utils/fetchReference';

interface IConfig {
    apiRoute: string;
    clientRoute: string;
}

interface ICreatePageState {
    fields: IFormField[];
    title: string;
}

const useCreatePage = ({
    apiRoute,
    clientRoute
}: IConfig) => {
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [ state, setState ] = useState<ICreatePageState>({
        title: '',
        fields: []
    });

    React.useEffect(() => {
        const fetchData = async () => {
            const data = await getMeta<IFormMetaResponse>(apiRoute, 'create');
            setState({
                fields: data?.form?.fields ?? [],
                title: data?.form?.title ?? '',
            })
        }
        void fetchData();
    }, []);

    const submitHandler = (values: IFormValues) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = await axios.post<IResponse<IFormSubmitResponse>>(apiRoute, values);
                if (data.success) {
                    showMessage(t('success', { ns: 'common' }), 'green');
                    if (pathname.endsWith('/new')) {
                        navigate(pathname.slice(0, ('/new'.length) * -1));
                    } else {
                        navigate(clientRoute);
                    }
                } else {
                    showMessage(t('error.title', { ns: 'common' }));
                }
                resolve(data);
            } catch (err) {
                reject(err);
            }
        })
    }

    return {
        state,
        submitHandler,
        fetchReference
    }
}

export default useCreatePage;