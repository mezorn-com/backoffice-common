import type { ComboboxItem } from '@mantine/core';
import dayjs from 'dayjs';
import { clone, drop, head, isNil, path, values as objectValues } from 'ramda';

import {
	FieldType,
	type IFormField,
	type INormalField,
	type SelectOption,
	UiType
} from '@/backoffice-common/types/form';
import { getArrayObjectByProp } from '@/backoffice-common/utils';
import { uploadFile } from '@/backoffice-common/utils/file-upload';
import i18n from '@/config/i18n';

const { t } = i18n;

const REGEX_NUMERIC = /^\d+$/;

export interface IFormValues {
	// biome-ignore lint/suspicious/noExplicitAny: TODO: Fix type
	// eslint-disable-next-line
	[key: string]: any;
}

export const SEPARATOR = '.';
export const LABEL_SEPARATOR = ' - ';

export const getFormItemPathByKey = (key: string): string[] => {
	return key.split(SEPARATOR);
};

export const getFormInitialValues = (
	fields: IFormField[],
	// biome-ignore lint/suspicious/noExplicitAny: TODO: use type
	// eslint-disable-next-line
	initialValues?: Record<string, any>
): IFormValues => {
	// TODO: make clone get value from there.
	const values: IFormValues = {};
	for (const field of fields) {
		switch (field.type) {
			case FieldType.OBJECT: {
				if (field.fields) {
					if (field.isArrayElement) {
						// TODO: Getting object values
						return getFormInitialValues(
							field.fields,
							initialValues ?? {}
						);
						// Old code below
						// return getFormInitialValues(field.fields, initialValues?.[field.key] ?? {});
					}
					values[field.key] = getFormInitialValues(
						field.fields,
						initialValues?.[field.key] ?? {}
					);
				}
				break;
			}
			case FieldType.ARRAY: {
				if (field.element) {
					const fieldElement = clone(field.element);
					fieldElement.isArrayElement = true;
					// TODO: Using loop in Array to get all values
					const arrayInitialValues = initialValues?.[field.key] ?? [];
					const arrayValues = arrayInitialValues.map(
						// biome-ignore lint/suspicious/noExplicitAny: TODO: Check later
						// eslint-disable-next-line
						(arrayValue: Record<string, any>) => {
							return getFormInitialValues(
								[ fieldElement ],
								arrayValue
							);
						}
					);
					values[field.key] = arrayValues;
					// Old code below
					// const value = getFormInitialValues([fieldElement]);
					// values[field.key] = [value];
				}
				break;
			}
			case FieldType.RENDER:
			case FieldType.GROUP: {
				break;
			}
			// case FieldType.NORMAL:
			default: {
				const initVal = initialValues?.[field.key] ?? undefined;
				values[field.key] = getInitialValue(field, initVal);
				break;
			}
		}
	}
	return values;
};

// biome-ignore lint/suspicious/noExplicitAny: use type
// eslint-disable-next-line
export const getInitialValue = (field: INormalField, initialValue?: any) => {
	switch (field.uiType) {
		case UiType.TEXT_INPUT: {
			return initialValue ?? field.value ?? '';
		}
		case UiType.CASCADING_SELECT: {
			return initialValue ?? field.value ?? null;
		}
		case UiType.SELECT: {
			return initialValue ?? null;
		}
		case UiType.TIME: {
			return initialValue ?? field.value ?? undefined;
		}
		case UiType.DATETIME: {
			if (initialValue === undefined) {
				return undefined;
			}
			const date = dayjs(initialValue);
			return date.isValid()
				? date.format(field.format ?? 'YYYY-MM-DD HH:mm')
				: undefined;
		}
		case UiType.DATE: {
			if (initialValue === undefined) {
				return undefined;
			}
			if (Array.isArray(initialValue)) {
				return initialValue.map(value => {
					const date = dayjs(value);
					return date.isValid()
						? date.format(field.format ?? 'YYYY-MM-DD')
						: undefined;
				});
			}
			const date = dayjs(initialValue);
			return date.isValid()
				? date.format(field.format ?? 'YYYY-MM-DD')
				: undefined;
		}
		case UiType.CHECKBOX: {
			return !!initialValue;
		}
		case UiType.SEARCH_SELECT: {
			return initialValue ?? undefined;
		}
		case UiType.FILE_UPLOAD: {
			return initialValue ?? undefined;
		}
		case UiType.YEAR: {
			return initialValue ? new Date(initialValue.toString()) : undefined;
		}
		case UiType.LOCATION: {
			if (initialValue?.latitude && initialValue?.longitude) {
				return {
					lat: initialValue.latitude,
					lng: initialValue.longitude
				};
			}
			return undefined;
		}
		case UiType.HTML_INPUT: {
			return initialValue ?? undefined;
		}
		default: {
			console.warn('Unknown UiType value: ', field.uiType);
			return undefined;
		}
	}
};

export const validator = (fields: IFormField[], values: IFormValues) => {
	const errors: { [key: string]: string | null } = {};
	for (const field of fields) {
		const isVisible = isFieldVisible(field, values);
		if (!isVisible || field.type === FieldType.GROUP) {
			// group type does not have key property
			continue;
		}
		const targetPath = getFormItemPathByKey(field.key);
		// biome-ignore lint/suspicious/noExplicitAny: TODO: use type
		// eslint-disable-next-line
		const value: any = path(targetPath, values);
		const isRequired = isFieldRequired(field, fields, values);
		if (isRequired) {
			errors[field.key] = getErrorMessage(field, value);
		}
	}
	return errors;
};

export const getErrorMessage = (
	field: IFormField,
	// biome-ignore lint/suspicious/noExplicitAny: TODO: use type
	// eslint-disable-next-line
	value: any
): null | string => {
	// if normal
	if (field.type !== FieldType.NORMAL) {
		return null;
	}
	if (field.uiType === UiType.CHECKBOX) {
		return null;
	}
	if (value === undefined || value === null || value === '') {
		return t('validation.error.enterValue', {
			ns: 'form',
			value: field.label
		});
	}
	if (field.uiType === UiType.TEXT_INPUT) {
		if (
			field.length &&
			value?.length &&
			((!field.numeric && field.length !== value?.length) ||
				(field.numeric && field.length !== value.toString().length))
		) {
			return t('validation.error.exactNLengthAllowed', {
				ns: 'form',
				value: field.length.toString()
			});
		}
		if (
			value?.length &&
			typeof field.maxLength === 'number' &&
			field.maxLength < value?.length
		) {
			return t('validation.error.maxNLengthAllowed', {
				ns: 'form',
				value: (field.maxLength ?? 0).toString()
			});
		}
		if (
			value?.length &&
			typeof field.minLength === 'number' &&
			field.minLength > value?.length
		) {
			return t('validation.error.minNLengthAllowed', {
				ns: 'form',
				value: (field.minLength ?? 0).toString()
			});
		}
		if (value?.length && field.numeric && !REGEX_NUMERIC.test(value)) {
			return t('validation.error.numberOnly', { ns: 'form' });
		}
	}
	return null;
};

export const isFieldVisible = (
	field: IFormField,
	values: IFormValues
): boolean => {
	if (!('visibility' in field)) {
		return true;
	}
	const targetKey = field?.visibility?.key ?? null;
	if (!targetKey) {
		return true;
	}
	const targetPath = getFormItemPathByKey(targetKey);
	const targetValue = path(targetPath, values) as string | number | boolean;
	if (field.visibility) {
		if ('hasValue' in field.visibility) {
			return !!targetValue;
		}
		if ('value' in field.visibility) {
			return targetValue === field.visibility.value;
		}
		if ('valueNotEquals' in field.visibility) {
			return targetValue !== field.visibility.valueNotEquals;
		}
	}
	return false;
};

const getPathFields = (
	fullPath: string[],
	fields: IFormField[]
): IFormField[] => {
	// biome-ignore lint/suspicious/noEvolvingTypes: TODO: Fix
	const result = [];
	const selfPath = head(fullPath);
	const rest = drop(1, fullPath);
	if (!selfPath) {
		return [];
	}
	const self = getArrayObjectByProp(fields, selfPath) as
		| IFormField
		| undefined;
	if (!self) {
		return [];
	}
	result.push(self);
	if ('fields' in self) {
		const children = getPathFields(rest, self.fields ?? []);
		result.push(...children);
	}
	return result;
};

export const isFieldRequired = (
	field: IFormField,
	fields: IFormField[],
	values: IFormValues
): boolean => {
	// case 1. buh parentuud ni required bas uuruu required uyed required bnaa.
	// case 2. parentuudiin required hamaaralguigeer sibling ni value avsan uyed uuruu required bol required bnaa.
	if ('required' in field && field.required) {
		if (!field.groupPath) {
			// uuruu required bas parentgui hamgiin gadna taliin objectod hamaarah uchir true butsaana.
			return true;
		}
		// case 1
		const parentPath = field.groupPath.split(SEPARATOR);
		const parentFields = getPathFields(parentPath, fields);
		if (
			parentFields.every(parentField => {
				if ('required' in parentField) {
					return !!parentField?.required;
				}
				return false;
			})
		) {
			return true;
		}
		// case2 sibling ni valuetai uguig shalgana.
		// check case 2
		// const parentPath = parentFields.map((parentField) => parentField.key);
		const parentValues = path(parentPath, values);

		if (typeof parentValues === 'object' && parentValues !== null) {
			// biome-ignore lint/correctness/noUnusedVariables: TODO: remove
			// eslint-disable-next-line
			for (const [key, value] of Object.entries(parentValues)) {
				if (value) {
					return true;
				}
			}
		}
	}

	return false;
};

export const getFormValueByKey = (
	key: string,
	values: IFormValues,
	separator = SEPARATOR
) => {
	return path(key.split(separator), values);
};

const getTransformedValue = async (
	field: IFormField,
	value: unknown
): Promise<unknown> => {
	// return new Promise(async resolve => {
	if (isNil(value) || !('uiType' in field)) {
		return undefined;
		// resolve(undefined);
		// return;
	}
	switch (field.uiType) {
		case UiType.FILE_UPLOAD: {
			if (value instanceof File) {
				const url = await uploadFile(value, {
					useFileName: field.useFileName,
					prefix: field.prefix ?? '',
					folderPath: field.folderPath ?? ''
				});
				return url;
				// resolve(url);
				// return;
			}
			// resolve(value || undefined);
			return value || undefined;
		}
		case UiType.CHECKBOX: {
			// resolve(!!value);
			return !!value;
		}
		case UiType.TEXT_INPUT: {
			if (field.number) {
				// resolve((value === 0 || value) ? value : undefined);
				return value === 0 || value ? value : undefined;
			}
			// resolve(value || undefined);
			return value || undefined;
		}
		case UiType.YEAR: {
			if (value && value instanceof Date) {
				// resolve(dayjs(value).year())
				return dayjs(value).year();
				// return;
			}
			return undefined;
			// resolve(undefined);
			// return
		}
		default: {
			// resolve(value);
			return value;
		}
	}
	// });
};

export const transformValuesAsync = async (
	fields: IFormField[],
	values: IFormValues,
	allValues: IFormValues
): Promise<IFormValues | undefined> => {
	// return new Promise(async resolve => {
	const transformedValues: IFormValues = {};
	for (const field of fields) {
		const isVisible = isFieldVisible(field, allValues);
		if (!isVisible) {
			continue;
		}
		switch (field.type) {
			case FieldType.GROUP: {
				// resolve(undefined);
				return undefined;
			}
			case FieldType.OBJECT: {
				if (field.fields) {
					if (field.isArrayElement) {
						// not sure if isArrayElement works
						// resolve(transformValuesAsync(field.fields, values[field.key], allValues));
						return transformValuesAsync(
							field.fields,
							values[field.key],
							allValues
						);
					}
					transformedValues[field.key] = await transformValuesAsync(
						field.fields,
						values[field.key],
						allValues
					);
				}
				break;
			}
			case FieldType.ARRAY: {
				if (field.element) {
					const fieldElement = clone(field.element);
					fieldElement.isArrayElement = true;
					// biome-ignore lint/suspicious/noExplicitAny: TODO: use type
					// eslint-disable-next-line
					const arrayValues: any = [];
					if ('fields' in field.element && field.element.fields) {
						for await (const elementValue of values[field.key]) {
							const transformedElementValue =
								await transformValuesAsync(
									field.element.fields,
									elementValue,
									allValues
								);
							if (transformedElementValue) {
								arrayValues.push(transformedElementValue);
							}
						}
					}
					transformedValues[field.key] = arrayValues;
				}
				break;
			}
			// case FieldType.NORMAL:
			default: {
				transformedValues[field.key] = await getTransformedValue(
					field,
					values[field.key]
				);
			}
		}
	}
	if (objectValues(transformedValues).every(value => value === undefined)) {
		return undefined;
		// resolve(undefined);
		// return;
	}
	return transformedValues;
	// resolve(transformedValues);
	// });
};

export const formatSelectValue = (options: SelectOption[]): ComboboxItem[] => {
	return options.map(option => ({
		value: option.value.toString(),
		label: option.label
	}));
};

// export const transformValues = (values: any): Record<string, any> => {
//     return map((value) => {
//         if (is(Object, value)) {
//             const transformedValues =  transformValues(value);
//             if (objectValues(transformedValues).every(value => value === undefined)) {
//                 return undefined;
//             }
//             return transformedValues;
//         }
//         if (!value && value !== false) {
//             return undefined;
//         }
//         return value;
//     }, values);
// }
