import { FormType, IFormField, IVisibility, WithVisibility } from '../form';
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
    listActions: MetaType[];
    itemActions?: Record<MetaType, IVisibility>;
    itemSubResources?: Record<string, IVisibility>;
}

export interface IFormResponseData {
    type: FormType;
    title?: string;
    fields: IFormField[];
}

export interface IFormMetaResponse {
    form: IFormResponseData;
    subResources?: ISubResource[];
    actions: (MetaType | string)[];
}

export type MetaType =
    'create' |
    'update' |
    'delete' |
    'list' |
    'get';