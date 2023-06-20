import { resources, defaultNS } from '@/config/i18n';
import { DEFAULT_LOCALE } from '@/config';

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: typeof resources[DEFAULT_LOCALE];
    }
}