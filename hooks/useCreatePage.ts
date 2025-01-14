import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import type { IFormValues } from '@/backoffice-common/components/form/helper';
import { showMessage } from '@/backoffice-common/lib/notification';
import type { IResponse } from '@/backoffice-common/types/api';
import type { IFormMetaResponse } from '@/backoffice-common/types/api/meta';
import type { IFormField } from '@/backoffice-common/types/form';
import { getMeta } from '@/backoffice-common/utils';
import fetchReference from '@/backoffice-common/utils/fetchReference';

interface IConfig {
	apiRoute: string;
	clientRoute: string;
}

interface ICreatePageState {
	fields: IFormField[];
	title: string;
}

const useCreatePage = ({ apiRoute, clientRoute }: IConfig) => {
	const { pathname } = useLocation();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [ state, setState ] = useState<ICreatePageState>({
		title: '',
		fields: []
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: TODO: Check later
	React.useEffect(() => {
		const fetchData = async () => {
			const data = await getMeta<IFormMetaResponse>(apiRoute, 'create');
			setState({
				fields: data?.form?.fields ?? [],
				title: data?.form?.title ?? ''
			});
		};
		void fetchData();
	}, []);

	const submitHandler = async (values: IFormValues) => {
		const { data } = await axios.post<IResponse<string>>(
			apiRoute,
			values
		);
		if (data.success) {
			showMessage(t('success', { ns: 'common' }), 'green');
			if (pathname.endsWith('/new')) {
				navigate(pathname.slice(0, '/new'.length * -1));
			} else {
				navigate(clientRoute);
			}
		} else {
			showMessage(t('error.title', { ns: 'common' }));
		}
		return data;
	};

	return {
		state,
		submitHandler,
		fetchReference
	};
};

export default useCreatePage;
