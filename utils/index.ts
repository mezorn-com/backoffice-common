import axios from 'axios';
import qs from 'qs';
import { clone, isEmpty } from 'ramda';
import type { ColumnDef } from '@tanstack/react-table';
import type { IColumn, IResponse } from '@/backoffice-common/types/api';
import type { MetaType } from '@/backoffice-common/types/api/meta';
import { IStringReplacer } from '@/backoffice-common/types/utils';

export const getMeta = <T>(url: string, action: MetaType, queryParams?: Record<string, string>): Promise<T> => {
    return new Promise(async (resolve) => {
        const queryParameters = qs.stringify(queryParams);
        const { data } = await axios.get<IResponse<T>>(`${url}/meta?action=${action}&${queryParameters}`);
        resolve(data.data);
    })
}

export const formatColumns = (columns: IColumn[]): ColumnDef<Record<string, unknown>>[] => {
    const formattedColumns: ColumnDef<Record<string, unknown>>[] = [];
    for (const column of columns) {
        if (column.type === 'render') {
            const tableColumn: ColumnDef<Record<string, unknown>> = {
                accessorKey: column.key,
                header: column.label,
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
    if (isEmpty(parameters)) {
        return url;
    }
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