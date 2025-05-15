import axios, { type RawAxiosRequestHeaders } from 'axios';

import { showMessage } from '@/backoffice-common/lib/notification';
import { API_URL } from '@/config';
import { getConfig } from '@/config/interceptor-config';
import useStore from '@/store';

import i18n from '../../config/i18n';

const { t, language } = i18n;

declare module 'axios' {
	interface AxiosRequestConfig {
		silent?: boolean;
		noAuthorization?: boolean;
	}
}

axios.interceptors.request.use(config => {
	if (!config.silent) {
		useStore.setState({ loading: true });
	}
	const state = useStore.getState();
	// @ts-expect-error TODO: declare type
	config.headers = {
		'Content-Type': 'application/json',
		'Accept-Language': language,
		...(config.headers as RawAxiosRequestHeaders) // <<<< this here
	};

	if (!config.noAuthorization && !config.headers.authorization) {
		config.headers.authorization = state?.auth?.token
			? `Bearer ${state?.auth?.token}`
			: undefined;
	}

	if (config.url && !config.url.startsWith('http')) {
		config.url = `${API_URL}${config.url}`;
	}

	return getConfig(config);
});

axios.interceptors.response.use(
	res => {
		if (!res?.config?.silent) {
			useStore.setState({ loading: false });
		}
		return res;
	},
	error => {
		if(error.status === 400 && error.response.statusText === 'Bad Request') {
			error.response.data.error.data.validationIssues.forEach((issue:any) => {
				showMessage(issue.message);
			})
		} else {
			showMessage(
				error?.response?.data?.error?.message ??
				t('messages.error', { ns: 'common' })
			);
		}
		if (
			error?.response?.status === 401 &&
			!error.config.url.endsWith('/login')
		) {
			useStore.getState().clearStore();
		}
		
		
		useStore.setState({ loading: false });
		return Promise.reject(error);
	}
);
