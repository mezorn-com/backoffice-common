import { produce } from 'immer';
import { clone, is, map, path, values as objectValues } from 'ramda';
import i18n from '@/config/i18n';
import type { IFormField } from '@/backoffice-common/types/form';
import { replaceString } from '@/backoffice-common/utils';
import dayjs from 'dayjs';
import { uploadFile } from '@/backoffice-common/utils/file-upload';

const { t, language } = i18n;

export interface IFormValues  {
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
        switch(field.type) {
            case 'normal': {
                // TODO: value[] use field groupPath later
                const initVal = initialValues?.[field.key] ?? undefined;
                values[field.key] = getInitialValue(field, initVal);
                break;
            }
            case 'object': {
                if (field.fields) {
                    if (field.isArrayElement) {
                        return getFormInitialValues(field.fields, initialValues?.[field.key] ?? {});
                    }
                    values[field.key] = getFormInitialValues(field.fields, initialValues?.[field.key] ?? {});
                }
                break;
            }
            case 'array': {
                if (field.element) {
                    const fieldElement = clone(field.element);
                    fieldElement.isArrayElement = true;
                    const value = getFormInitialValues([fieldElement]);
                    values[field.key] = [value];
                }
                break;
            }
        }
    }
    return values;
};

export const getInitialValue = (field: IFormField, initialValue?: any) => {
    switch(field.uiType) {
        case 'text-input': {
            return initialValue ?? field.value ?? '';
        }
        case 'cascading-select': {
            return initialValue ?? field.value ?? null;
        }
        case 'select': {
            return initialValue ?? null;
        }
        case 'date': {
            if (initialValue === undefined) {
                return undefined;
            }
            const date = dayjs(initialValue);
            return date.isValid() ? date.format(field.format ?? 'YYYY-MM-DD') : undefined
        }
        case 'checkbox': {
            return false;
        }
        default:
            return undefined;
    }
};

export const refactorFields = (fields: IFormField[], parentFields?: IFormField[]): IFormField[] => {
    const array: IFormField[] = [];
    for (const originalField of fields) {
        let field = clone(originalField);
        let keyPrefix = field.key;
        let labelPrefix = field.label ?? '';
        const parentsClone = clone(parentFields);
        let groupPath = undefined;
        for (const parentField of (parentsClone ?? []).reverse()) {
            let parentKey = parentField.key;
            if (parentField.type === 'array') {
                parentKey = `${parentKey}.0`; // TODO: 0 ??
            }
            keyPrefix = `${parentKey}${SEPARATOR}${keyPrefix}`;

            if (parentField.label) {
                labelPrefix = `${parentField.label}${LABEL_SEPARATOR}${labelPrefix}`;
            }
            if (parentField.groupPath) {
                groupPath = parentField.groupPath;
            }
        }
        if (groupPath) {
            field.groupPath = groupPath;
        }
        switch(field.type) {
            case 'object': {
                if (field.fields?.length) {
                    const parents = parentFields ? [ ...parentFields, field ] : [field];
                    array.push(...refactorFields(field.fields, parents));
                }
                break;
            }
            case 'array': {
                if (field.element) {
                    const parents = parentFields ? [ ...parentFields, field ] : [field];
                    if (field.element.type === 'array') {
                        const elements = (field.element?.fields?? []).map(fieldItem => {
                            return produce(fieldItem, draft => {
                                draft.groupPath = keyPrefix;
                            });
                        })
                        array.push(...refactorFields(elements, parents));
                    } else {
                        const element = produce(field.element, draft => {
                            draft.groupPath = keyPrefix;
                        });
                        array.push(...refactorFields([element], parents));
                    }
                }
                break;
            }
            default: {
                array.push(
                    produce(field, draftState => {
                        draftState.key = keyPrefix;
                        draftState.label = labelPrefix;
                        if (parentFields) {
                            draftState.parentFields = parentFields;
                        }
                    })
                );
            }
        }
    }
    return array;
};

export const validator = (values: IFormValues, fields: IFormField[]) => {
    let errors: { [key: string]: string | null; } = {};
    for (const field of fields) {
        const targetPath = getFormItemPathByKey(field.key);
        const value: any = path(targetPath, values);
        const isRequired = isFieldRequired(field, values);
        errors[field.key] = getErrorMessage(field, isRequired, value);
    }
    return errors;
};

export const getErrorMessage = (field: IFormField, isRequired: boolean, value: any): null | string => {
    if (isRequired) {
        if (field.uiType === 'checkbox') {
            return null;
        }
        if (!value) {
            return replaceString(
                t('validation.error.enterValue', { ns: 'form' }),
                [
                    {
                        match: '{{-REPLACE_VALUE-}}',
                        replace: field.label ?? t('value', { ns: 'form' })
                    }
                ]
            );
        }
        if (field.length && ((!field.numeric && field.length !== value?.length) || (field.numeric && field.length !== value.toString().length))) {
            return replaceString(
                t('validation.error.exactNLengthAllowed', { ns: 'form' }),
                [
                    {
                        match: '{{-REPLACE_VALUE-}}',
                        replace: field.length.toString(),
                    }
                ]
            );
        }
        if (typeof field.maxLength === 'number' && field.maxLength < value?.length) {
            return replaceString(
                t('validation.error.maxNLengthAllowed', { ns: 'form' }),
                [
                    {
                        match: '{{-REPLACE_VALUE-}}',
                        replace: (field.maxLength ?? 0).toString(),
                    }
                ]
            );
        }
        if (typeof field.minLength === 'number' && field.minLength > value?.length) {
            return replaceString(
                t('validation.error.minNLengthAllowed', { ns: 'form' }),
                [
                    {
                        match: '{{-REPLACE_VALUE-}}',
                        replace: (field.minLength ?? 0).toString(),
                    }
                ]
            )
        }
        if (field.numeric && !/^\d+$/.test(value)) {
            return t('validation.error.numberOnly', { ns: 'form' })
        }
    }
    return null;
};

export const isFieldVisible = (field: IFormField, values: IFormValues): boolean => {
    if (!field.visibility) {
        return true;
    }
    const targetKey = field?.visibility?.key ?? null;
    if (!targetKey) {
        return true;
    }
    const targetPath = getFormItemPathByKey(targetKey);
    const targetValue = path(targetPath, values) as string | number | boolean;
    if (field.visibility?.hasValue === true) {
        return !!targetValue;
    }
    if (field.visibility.value) {
        return targetValue === field.visibility.value;
    }
    if (field.visibility.valueNotEquals) {
        return targetValue !== field.visibility.value;
    }
    return false;
};

export const isFieldRequired = (field: IFormField, values: IFormValues): boolean => {
    // case 1. buh parentuud ni required bas uuruu required uyed required bnaa.
    // case 2. parentuudiin required hamaaralguigeer sibling ni value avsan uyed uuruu required bol required bnaa.
    if (field.required) {
        if (!field.parentFields?.length) {
            // uuruu required bas parentgui hamgiin gadna taliin objectod hamaarah uchir true butsaana.
            return true;
        } else {
            // case 1
            if (field.parentFields.every(parentField =>  parentField.required)) {
                return true;
            }

            // case2 sibling ni valuetai uguig shalgana.
            const parentPath = field.parentFields.map((parentField) => parentField.key);
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
}

export const getFormValueByKey = (key: string, values: IFormValues, separator = SEPARATOR) => {
    return path(key.split(separator), values);
};

const getTransformedValue = (field: IFormField, value: IFormField['value']): Promise<IFormField['value']> => {
    return new Promise(async (resolve) => {
        if (!value && value !== false) {
            resolve(undefined);
            return;
        }
        switch (field.uiType) {
            case 'file-upload': {
                const url = await uploadFile(value, {
                    useFileName: !!field.useFileName,
                    prefix: field.uploadPrefix ?? '',
                    folderPath: field.uploadFolderPath ?? ''
                });
                resolve(url);
                return;
            }
            case 'checkbox': {
                resolve(!!value);
                return;
            }
            default: {
                resolve(value);
                return;
            }
        }
    })
}

export const transformValuesAsync = (fields: IFormField[], values: IFormValues): Promise<IFormValues | undefined> => {
    return new Promise(async (resolve) => {
        let transformedValues: IFormValues = {};
        for (const field of fields) {
            switch(field.type) {
                case 'object': {
                    if (field.fields) {
                        if (field.isArrayElement) {
                            // not sure if isArrayElement works
                            resolve(transformValuesAsync(field.fields, values[field.key]))
                            return;
                        }
                        transformedValues[field.key] = await transformValuesAsync(field.fields, values[field.key]);
                    }
                    break;
                }
                case 'array': {
                    if (field.element) {
                        const fieldElement = clone(field.element);
                        fieldElement.isArrayElement = true;
                        const arrayValues: any = [];
                        if (field.element.fields) {
                            for await (const elementValue of values[field.key]) {
                                const transformedElementValue = await transformValuesAsync(field.element.fields, elementValue);
                                if (transformedElementValue) {
                                    arrayValues.push(transformedElementValue);
                                }
                            }
                        }
                        transformedValues[field.key] = arrayValues;
                    }
                    break;
                }
                case 'normal':
                default: {
                    transformedValues[field.key] = await getTransformedValue(field, values[field.key]);
                }
            }
        }
        if (objectValues(transformedValues).every(value => value === undefined)) {
            resolve(undefined);
            return;
        }
        resolve(transformedValues)
    })
}

// export const transformValues = <T>(values: T): Record<string, any> => {
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