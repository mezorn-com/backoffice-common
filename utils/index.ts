import type { IResponse } from '@/backoffice-common/types/api';
import type { MetaType } from '@/backoffice-common/types/api/meta';
import {
	FieldType,
	type IFormField,
	type RenderField,
} from '@/backoffice-common/types/form';
import type { IStringReplacer } from '@/backoffice-common/types/utils';
import type { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import qs from 'qs';
import { clone, isEmpty } from 'ramda';

export const getMeta = async <T>(
	url: string,
	action: MetaType,
	queryParams?: Record<string, string>,
): Promise<T> => {
	const queryParameters = qs.stringify(queryParams);
	const { data } = await axios.get<IResponse<T>>(
		`${url}/meta?action=${action}&${queryParameters}`,
	);
	return data.data;
};

export const isRenderField = (field: IFormField): field is RenderField => {
	return 'type' in field && field.type === FieldType.RENDER;
};

export const formatColumns = (
	fields: IFormField[],
): ColumnDef<Record<string, unknown>>[] => {
	const formattedColumns: ColumnDef<Record<string, unknown>>[] = [];
	for (const field of fields) {
		if (isRenderField(field)) {
			const tableColumn: ColumnDef<Record<string, unknown>> = {
				accessorKey: field.key,
				header: field.label,
				meta: {
					field,
				},
			};
			formattedColumns.push(tableColumn);
		}
	}
	return formattedColumns;
};

export const replaceString = (
	string: string,
	pattern: IStringReplacer[],
): string => {
	let result = string;
	for (const item of pattern) {
		result = result.replace(item.match, item.replace);
	}
	return result;
};

export const combineURL = (
	url: string,
	parameters: Record<string, unknown>,
): string => {
	if (isEmpty(parameters)) {
		return url;
	}
	const queryParams = qs.stringify(parameters);
	if (url.includes('?')) {
		return `${url}&${queryParams}`;
	}
	return `${url}?${queryParams}`;
};

export const capitalize = (string: string) => {
	if (!string.length) {
		return string;
	}
	return `${string[0].toUpperCase()}${string.substring(1).toLowerCase()}`;
};

// biome-ignore lint/suspicious/noExplicitAny: TODO: Check later
export const isNumber = (n: any): boolean => {
	return !Number.isNaN(Number.parseFloat(n)) && !Number.isNaN(n - 0);
};

const REGEX_NUMBER = /^[0-9\b]+$/;
export const isUserInputNumber = (value: string): boolean => {
	return value === '' || REGEX_NUMBER.test(value);
};

export const getArrayObjectByProp = (
	// biome-ignore lint/suspicious/noExplicitAny: TODO: use types
	array: Record<any, any>[],
	key: string,
	propertyKey = 'key',
	// biome-ignore lint/suspicious/noExplicitAny: TODO: use types
): Record<any, any> | undefined => {
	const arrayClone = clone(array);
	return arrayClone.find(item => item[propertyKey] === key);
};

export const replacePathParameters = (
	url: string,
	// biome-ignore lint/suspicious/noExplicitAny: TODO: use type
	object: Record<string, any>,
) => {
	const re = /\{([^}]+)\}/g;
	const result = url.replace(re, (completeMatch, match) => {
		if (!object[match]) {
			console.warn(`Couldn't find a value ${match} in: `, object);
			return completeMatch;
		}
		return object?.[match]?.toString() ?? completeMatch;
	});
	if (result.startsWith('/')) {
		return result;
	}
	return `/${result}`;
};
