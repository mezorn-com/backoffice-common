import { IFieldRenderType } from '../api';

export interface IFormField {
    type: FieldType;
    key: string;
    label?: string;
    required?: boolean;
    uiType?: UiType;
    maxLength?: number;
    minLength?: number;
    length?: number;
    numeric?: boolean;
    number?: boolean;
    fields?: IFormField[];
    refCode?: string;
    multiLine?: boolean;
    secret?: boolean;
    visibility?: IVisibility;
    value?: any;
    multiple?: boolean;
    optionsApi?: {
        uri: string;
        queryParams?: string[];
    };
    options?: IFormOption[];
    format?: string;
    element?: IFormField;
    renderType?: IFieldRenderType;
    uri?: string;
    retrieveApi?: {
        uri: string;
    };
    suggestApi?: {
        uri: string;
        searchKey: string;
    };

    mimeType?: string;
    useFileName?: boolean;
    folderPath?: string;
    prefix?: string;

    // Custom Properties
    parentFields?: IFormField[]; // not necessary now
    isArrayElement?: boolean;
    groupPath?: string;
}

interface IUploadForm {
    mimeType?: string;
    useFileName?: boolean;
    folderPath?: string
    prefix?: string;
}

export interface IFormOption {
    label: string;
    value: string;
}

type VisibilityType =
    { value: unknown; }
|   { hasValue: boolean }
|   { valueNotEquals: unknown };

export type IVisibility = VisibilityType & { key: string; };

export type FormType =
    'normal' |
    'tabbed';

export type FieldType =
    'normal' |
    'render' |
    'array' |
    'object' |
    'group';

export type UiType =
    'text-input'
    | 'checkbox'
    | 'select'
    | 'date'
    | 'cascading-select'
    | 'map-address-picker'
    | 'file-upload'
    | 'html-input'
    ;
