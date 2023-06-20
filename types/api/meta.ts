import { FormType, IFormField } from '../form';
import { IColumn } from './index';

export type IMetaType = 'normal';

export interface ISubResource {
    resource: string;
    label: string;
}

export interface IListMetaResponse {
    form: {
        type: IMetaType;
        fields: IColumn[];
        title?: string;
    };
    subResources: ISubResource[];
}
export interface IFormResponseData {
    type: FormType;
    title?: string;
    fields: IFormField[];
}


export interface IFormMetaResponse {
    form: IFormResponseData;
    subResources?: ISubResource[];
}

export type MetaType =
    'create' |
    'update' |
    'delete' |
    'list' |
    'get';

