import { getToken } from '@mezorn-com/mzrn-bo-sso';
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

axios.interceptors.request.use(async config => {
	if (!config.silent) {
		useStore.setState({ loading: true });
	}
	// @ts-expect-error TODO: declare type
	config.headers = {
		'Content-Type': 'application/json',
		'Accept-Language': language,
		...(config.headers as RawAxiosRequestHeaders) // <<<< this here
	};

	if (!config.noAuthorization && !config.headers.authorization) {
		const token = await getToken(60);
		config.headers.authorization = `Bearer ${token}`;
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
		showMessage(
			error?.response?.data?.error?.message ??
				t('messages.error', { ns: 'common' })
		);
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
