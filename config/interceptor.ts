import axios from 'axios';
import useStore from '@/store';
import { API_URL } from "@/config";
import i18n from '../../config/i18n';
import type { RawAxiosRequestHeaders } from 'axios';
import { showMessage } from '@/backoffice-common/lib/notification';

const { t, language } = i18n;

declare module 'axios' {
    interface AxiosRequestConfig {
        silent?: boolean;
        noAuthorization?: boolean;
    }
}

axios.interceptors.request.use((config) => {
    !config.silent && useStore.setState({ loading: true });
    const state = useStore.getState();
    // @ts-ignore
    config.headers = {
        "Content-Type": "application/json",
        'Accept-Language': language,
        ...(config.headers as RawAxiosRequestHeaders), // <<<< this here
    };

    if (!config.noAuthorization && !config.headers.Authorization) {
        config.headers.Authorization = state?.auth?.token ? `Bearer ${state?.auth?.token}` : undefined;
    }

    if (config.url && !config.url.startsWith("http")) {
        config.url = `${API_URL}${config.url}`;
    }

    return config;
});

axios.interceptors.response.use(
    (res) => {
        !res?.config?.silent && useStore.setState({ loading: false });
        return res;
    },
    (error) => {
        if (error?.response?.data?.error?.isReadableMessage) {
            showMessage(error?.response?.data?.error?.message ?? t('messages.error', { ns: 'common' }));
        }
        if (error?.response?.status === 401) {
            useStore.getState().clearStore();
        }
        useStore.setState({ loading: false });
        return Promise.reject(error);
    }
);
