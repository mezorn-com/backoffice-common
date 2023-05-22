import axios from 'axios';
import qs from 'qs';
import { clone } from 'ramda';
import type { Column } from 'react-table';
import type { IColumn, IResponse } from '@/backoffice-common/types/api';
import type { MetaType } from '@/backoffice-common/types/api/meta';
import { IStringReplacer } from '@/backoffice-common/types/utils';

export const getMeta = <T>(url: string, action: MetaType): Promise<T> => {
    return new Promise(async (resolve) => {
        const { data } = await axios.get<IResponse<T>>(`${url}/meta?action=${action}`);
        resolve(data.data);
    })
}
export const formatColumns = (columns: IColumn[]): Column<Record<string, unknown>>[] => {
    const formattedColumns: Column<Record<string, unknown>>[] = [];
    for (const column of columns) {
        if (column.type === 'render') {
            const tableColumn: Column<Record<string, unknown>> = {
                accessor: column.key,
                Header: column.label,
                ...clone(column)
            };
            formattedColumns.push(tableColumn);
        }
    }
    return formattedColumns;
}

export const replaceString = (string: string, pattern: IStringReplacer[]): string => {
    let result = string;
    for (const item of pattern) {
        result = result.replace(item.match, item.replace);
    }
    return result;
}

export const combineURL = (url: string, parameters: Record<string, unknown>): string => {
    return `${url}?${qs.stringify(parameters)}`;
};

export const capitalize = (string: string) => {
    if (!string.length) {
        return string;
    }
    return `${string[0].toUpperCase()}${string.substring(1).toLowerCase()}`;
};

export const isNumber = (n: any): boolean => {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
};

export const isUserInputNumber = (value: string): boolean => {
    const re = /^[0-9\b]+$/;
    return value === "" || re.test(value);
};