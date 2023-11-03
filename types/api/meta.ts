import { FormType, IFormField, INormalField, IVisibility, WithVisibility } from '../form';
import { IColumn } from './index';

export type IMetaType = 'normal';

export type SubResources = Record<string, WithCondition & WithIcon & WithLabel>;

type Conditional = {
    key: string
} & ({
    value: unknown
} | {
    hasValue: boolean
} | {
    valueNotEquals: unknown
})

interface WithCondition {
    condition?: Conditional
}

interface Confirmable {
    confirmation?: {
        dialogText?: string
        buttonText?: string
    }
}

interface WithIcon {
    icon?: {
        type: string
        value: string
        color?: string
    }
}

interface WithLabel {
    label?: string
}

export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

interface Invokable {
    api?: {
        uri: string
        method: Method;
        form: Form;
    }
}

export type ListItemActionKey =  'update' | 'delete' | 'get' | string;
export type ListItemAction = true | WithCondition & Confirmable & Invokable & WithIcon & WithLabel

export type ListActionKey = 'create' | string;
export type ListAction = true | WithCondition & Confirmable & Invokable & WithIcon & WithLabel;

export type BulkAction = Invokable & WithLabel;

export interface IListMetaResponse {
    form: Form;
    subResources: SubResources;
    listActions: Partial<Record<ListActionKey, ListAction>>;
    listItemActions: Partial<Record<ListItemActionKey, ListItemAction>>;
    filter?: INormalField[];
    bulkItemActions: Record<string, BulkAction>
}

export interface Form {
    type: FormType;
    title?: string;
    fields: IFormField[];
}

export interface IFormMetaResponse {
    form: Form;
    subResources?: SubResources;
    actions?: Record<MetaType | string, ListAction>;
}

export type MetaType =
    'create' |
    'update' |
    'delete' |
    'list' |
    'get';