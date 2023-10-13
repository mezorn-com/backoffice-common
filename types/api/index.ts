export type IFieldRenderType = 'text' | 'link' | 'boolean';

export interface IResponse<DataType> {
    data: DataType;
    success: boolean;
}

export interface IListResponseData {
    docs: Record<string, unknown>[];
    limit: number;
    page: number;
    totalPage: number;
    totalData?: number;
    [key: string]: unknown;
}

type IFieldType = 'render';

export interface IListResponse extends IResponse<any> {
    data: IListResponseData;
}

export interface IFormSubmitResponse extends IResponse<string> {
}

export type ResourceAction =
    'create' |
    'update' |
    'delete' |
    'list' |
    'get' |
    '*';

export interface IColumn {
    key: string;
    label: string;
    type: IFieldType;
    renderType: IFieldRenderType;
}

export interface IReference {
    name: string;
    code: string;
    parent: string;
    isLeaf: boolean;
}

export interface IReferenceListResponse extends IResponse<any> {
    data: IReferenceListData;
}

export interface IReferenceListData {
    page: number;
    totalPage: number;
    limit: number;
    docs: IReference[];
}

export interface ISelectOption {
    value: string;
    label: string;
    description?: string;
}

interface FileUploadResult {
    fileUrl: string;
}

export interface IFileUploadResponse extends IResponse<any>{
    status: string;
    result: FileUploadResult[];
}