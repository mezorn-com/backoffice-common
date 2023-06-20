import { IStringReplacer } from '@/backoffice-common/types/utils';

export const getSubResourceUrl = (url: string, array: IStringReplacer[]): string => {
    let result = url;
    for (const item of array) {
        result = result.replace(item.match, item.replace);
    }
    if (!result.startsWith('/')) {
        return `/${result}`;
    }
    return result;
};

export const q = () => {

}