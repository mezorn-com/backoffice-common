import axios from 'axios';
import { dropLast } from 'ramda';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import type { IFormValues } from '@/backoffice-common/components/form/helper';
import { showMessage } from '@/backoffice-common/lib/notification';
import type { IResponse } from '@/backoffice-common/types/api';
import type { IFormMetaResponse } from '@/backoffice-common/types/api/meta';
import type { IFormField } from '@/backoffice-common/types/form';
import { getMeta } from '@/backoffice-common/utils';

interface IConfig {
	apiRoute: string;
	clientRoute: string;
	id: string;
	// biome-ignore lint/suspicious/noExplicitAny: TODO: Fix type
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onFetch?: (response: IResponse<Record<any, any>>) => void;
}

interface IEditPageState {
	fields: IFormField[];
	// biome-ignore lint/suspicious/noExplicitAny: TODO: Fix type
	// eslint-disable-next-line
	values: Record<string, any>;
	title: string;
	ready: boolean;
}

const useEditPage = ({ apiRoute, clientRoute, id, onFetch }: IConfig) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [ state, setState ] = React.useState<IEditPageState>({
		fields: [],
		values: {},
		title: '',
		ready: false
	});

	React.useEffect(() => {
		void fetchData();
	}, []);

	const fetchData = async () => {
		const data = await getMeta<IFormMetaResponse>(apiRoute, 'update', {
			resourceId: id
		});
		const { data: formValuesResponse } = await axios.get<
			// biome-ignore lint/suspicious/noExplicitAny: TODO: use types
			// eslint-disable-next-line
			IResponse<Record<string, any>>
		>(`${apiRoute}/${id}`);
		setState({
			title: data?.form?.title ?? '',
			values: formValuesResponse.data,
			fields: data?.form?.fields ?? [],
			ready: true
		});
		onFetch?.(formValuesResponse);
	};

	const submitHandler = async (values: IFormValues) => {
		// biome-ignore lint/suspicious/noExplicitAny: TODO: use type
		// eslint-disable-next-line
		const { data } = await axios.put<IResponse<any>>(
			`${apiRoute}/${id}`,
			values
		);
		if (data.success) {
			showMessage(t('success', { ns: 'common' }), 'green');
			const uriParts = pathname.split('/');
			if (uriParts[uriParts.length - 1] === 'edit') {
				const redirectPath = dropLast(2, uriParts).join('/');
				navigate(redirectPath);
			} else {
				navigate(clientRoute);
			}
		} else {
			showMessage(t('error.title', { ns: 'common' }));
		}
	};

	return {
		state,
		submitHandler,
		fetchData
	};
};

export default useEditPage;
