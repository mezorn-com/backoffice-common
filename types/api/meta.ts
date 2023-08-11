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

interface Invokable {
    api?: {
        uri: string
        method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    }
}

export interface IActionMeta {
    confirmation?: {
        dialogText?: string;
        buttonText?: string;
    };
    icon?: {
        type: string;
        value: string;
        color: string;
    };
    api?: {
        uri: string;
        method: string;
    }
}

export type ListItemActionKey =  'update' | 'delete' | 'get' | string;
export type ListItemAction = true | WithCondition & Confirmable & Invokable & WithIcon & WithLabel

export type ListActionKey = 'create' | string;
export type ListAction = true | WithCondition & Confirmable & Invokable & WithIcon & WithLabel;


export interface IListMetaResponse {
    form: {
        type: IMetaType;
        fields: IColumn[];
        title?: string;
    };
    subResources: SubResources;
    listActions: Partial<Record<ListActionKey, ListAction>>;
    listItemActions: Partial<Record<ListItemActionKey, ListItemAction>>;
    filter?: INormalField[];
}

export interface IFormResponseData {
    type: FormType;
    title?: string;
    fields: IFormField[];
}

export interface IFormMetaResponse {
    form: IFormResponseData;
    subResources?: SubResources;
    // actions: (MetaType | string)[];
    actions?: Record<MetaType | string, ListAction>;
}

export type MetaType =
    'create' |
    'update' |
    'delete' |
    'list' |
    'get';