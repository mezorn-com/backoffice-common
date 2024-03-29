import { clone, drop, head, isNil, path, values as objectValues } from 'ramda';
import i18n from '@/config/i18n';
import type { SelectOption } from '@/backoffice-common/types/form';
import { FieldType, IFormField, INormalField, UiType } from '@/backoffice-common/types/form';
import { getArrayObjectByProp } from '@/backoffice-common/utils';
import dayjs from 'dayjs';
import { uploadFile } from '@/backoffice-common/utils/file-upload';
import type { ComboboxItem } from '@mantine/core';

const { t, language } = i18n;

export interface IFormValues {
	[key: string]: any;
}

export const SEPARATOR = '.';
export const LABEL_SEPARATOR = ' - ';

export const getFormItemPathByKey = (key: string): string[] => {
	return key.split(SEPARATOR);
};

export const getFormInitialValues = (fields: IFormField[], initialValues?: Record<string, any>): IFormValues => {
	// TODO: make clone get value from there.
	let values: IFormValues = {};
	for (const field of fields) {
		switch (field.type) {
			case FieldType.OBJECT: {
				if (field.fields) {
					if (field.isArrayElement) {
						// TODO: Getting object values
						return getFormInitialValues(field.fields, initialValues ?? {});
						// Old code below
						// return getFormInitialValues(field.fields, initialValues?.[field.key] ?? {});
					}
					values[field.key] = getFormInitialValues(field.fields, initialValues?.[field.key] ?? {});
				}
				break;
			}
			case FieldType.ARRAY: {
				if (field.element) {
					const fieldElement = clone(field.element);
					fieldElement.isArrayElement = true;
					// TODO: Using loop in Array to get all values
					const arrayInitialValues = initialValues?.[field.key] ?? [];
					const arrayValues = arrayInitialValues.map((arrayValue: Record<string, any>) => {
						return getFormInitialValues([fieldElement], arrayValue);
					});
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
			case FieldType.NORMAL:
			default: {
				const initVal = initialValues?.[field.key] ?? undefined;
				values[field.key] = getInitialValue(field, initVal);
				break;
			}
		}
	}
	return values;
};

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
			return date.isValid() ? date.format(field.format ?? 'YYYY-MM-DD HH:mm') : undefined;
		}
		case UiType.DATE: {
			if (initialValue === undefined) {
				return undefined;
			}
			const date = dayjs(initialValue);
			return date.isValid() ? date.format(field.format ?? 'YYYY-MM-DD') : undefined;
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
				}
			}
			return undefined;
		}
		default: {
			console.warn('Unknown UiType value: ', field.uiType);
			return undefined;
		}
	}
};

export const validator = (fields: IFormField[], values: IFormValues) => {
	let errors: { [key: string]: string | null } = {};
	for (const field of fields) {
		const isVisible = isFieldVisible(field, values);
		if (!isVisible || field.type === FieldType.GROUP) {
			// group type does not have key property
			continue;
		}
		const targetPath = getFormItemPathByKey(field.key);
		const value: any = path(targetPath, values);
		const isRequired = isFieldRequired(field, fields, values);
		if (isRequired) {
			errors[field.key] = getErrorMessage(field, value);
		}
	}
	return errors;
};

export const getErrorMessage = (field: IFormField, value: any): null | string => {
	// if normal
	if (field.type !== FieldType.NORMAL) {
		return null;
	}
	if (field.uiType === UiType.CHECKBOX) {
		return null;
	}
	if (value === undefined || value === null || value === '') {
		return t('validation.error.enterValue', { ns: 'form', value: field.label });
	}
	if (field.uiType === UiType.TEXT_INPUT) {
		if (field.length && value?.length && ((!field.numeric && field.length !== value?.length) || (field.numeric && field.length !== value.toString().length))) {
			return t('validation.error.exactNLengthAllowed', { ns: 'form', value: field.length.toString() })
		}
		if (value?.length && typeof field.maxLength === 'number' && field.maxLength < value?.length) {
			return t('validation.error.maxNLengthAllowed', { ns: 'form', value: (field.maxLength ?? 0).toString() })
		}
		if (value?.length && typeof field.minLength === 'number' && field.minLength > value?.length) {
			return t('validation.error.minNLengthAllowed', { ns: 'form', value: (field.minLength ?? 0).toString() })
		}
		if (value?.length && field.numeric && !/^\d+$/.test(value)) {
			return t('validation.error.numberOnly', { ns: 'form' });
		}
	}
	return null;
};

export const isFieldVisible = (field: IFormField, values: IFormValues): boolean => {
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

const getPathFields = (fullPath: string[], fields: IFormField[]): IFormField[] => {
	const result = [];
	const selfPath = head(fullPath);
	const rest = drop(1, fullPath);
	if (!selfPath) {
		return [];
	}
	const self = getArrayObjectByProp(fields, selfPath) as IFormField | undefined;
	if (!self) {
		return [];
	}
	result.push(self);
	if ('fields' in self) {
		const children = getPathFields(rest, self.fields ?? []);
		result.push(...children)
	}
	return result;
}

export const isFieldRequired = (field: IFormField, fields: IFormField[], values: IFormValues): boolean => {
	// case 1. buh parentuud ni required bas uuruu required uyed required bnaa.
	// case 2. parentuudiin required hamaaralguigeer sibling ni value avsan uyed uuruu required bol required bnaa.
	if ('required' in field && field.required) {
		if (!field.groupPath) {
		    // uuruu required bas parentgui hamgiin gadna taliin objectod hamaarah uchir true butsaana.
		    return true;
		} else {
		    // case 1
			const parentPath = field.groupPath.split(SEPARATOR);
			const parentFields = getPathFields(parentPath, fields);
			if (parentFields.every(parentField => {
				if ('required' in parentField) {
					return !!parentField?.required
				}
				return false;
			})) {
			    return true;
			}
		    // case2 sibling ni valuetai uguig shalgana.
			// check case 2
		    // const parentPath = parentFields.map((parentField) => parentField.key);
		    const parentValues = path(parentPath, values);

		    if (typeof parentValues === 'object' && parentValues !== null) {
		        for (const [ key, value ] of Object.entries(parentValues)) {
		            if (value) {
		                return true;
		            }
		        }
		    }
		}
	}
	return false;
};

export const getFormValueByKey = (key: string, values: IFormValues, separator = SEPARATOR) => {
	return path(key.split(separator), values);
};

const getTransformedValue = (field: IFormField, value: unknown): Promise<unknown> => {
	return new Promise(async resolve => {
		if (isNil(value) || !('uiType' in field)) {
			resolve(undefined);
			return;
		}
		switch (field.uiType) {
			case UiType.FILE_UPLOAD: {
				if (value instanceof File) {
					const url = await uploadFile(value, {
						useFileName: field.useFileName,
						prefix: field.prefix ?? '',
						folderPath: field.folderPath ?? '',
					});
					resolve(url);
					return;
				}
				resolve(value || undefined);
				return;
			}
			case UiType.CHECKBOX: {
				resolve(!!value);
				return;
			}
			case UiType.TEXT_INPUT: {
				if (field.number) {
					resolve((value === 0 || value) ? value : undefined);
					return;
				}
				resolve(value || undefined);
				return;
			}
			case UiType.YEAR: {
				if (value && value instanceof Date) {
					resolve(dayjs(value).year())
					return;
				}
				resolve(undefined);
				return
			}
			default: {
				resolve(value);
				return;
			}
		}
	});
};

export const transformValuesAsync = (fields: IFormField[], values: IFormValues, allValues: IFormValues): Promise<IFormValues | undefined> => {
	return new Promise(async resolve => {
		let transformedValues: IFormValues = {};
		for (const field of fields) {
			const isVisible = isFieldVisible(field, allValues);
			if (!isVisible) {
				continue;
			}
			switch (field.type) {
				case FieldType.GROUP: {
					resolve(undefined);
					return;
				}
				case FieldType.OBJECT: {
					if (field.fields) {
						if (field.isArrayElement) {
							// not sure if isArrayElement works
							resolve(transformValuesAsync(field.fields, values[field.key], allValues));
							return;
						}
						transformedValues[field.key] = await transformValuesAsync(field.fields, values[field.key], allValues);
					}
					break;
				}
				case FieldType.ARRAY: {
					if (field.element) {
						const fieldElement = clone(field.element);
						fieldElement.isArrayElement = true;
						const arrayValues: any = [];
						if ('fields' in field.element && field.element.fields) {
							for await (const elementValue of values[field.key]) {
								const transformedElementValue = await transformValuesAsync(field.element.fields, elementValue, allValues);
								if (transformedElementValue) {
									arrayValues.push(transformedElementValue);
								}
							}
						}
						transformedValues[field.key] = arrayValues;
					}
					break;
				}
				case FieldType.NORMAL:
				default: {
					transformedValues[field.key] = await getTransformedValue(field, values[field.key]);
				}
			}
		}
		if (objectValues(transformedValues).every(value => value === undefined)) {
			resolve(undefined);
			return;
		}
		resolve(transformedValues);
	});
};

export const formatSelectValue = (options: SelectOption[]): ComboboxItem[] => {
	return options.map(option => ({
		value: option.value.toString(),
		label: option.label
	}))
}

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
