import type { FieldType, RenderType } from '@/backoffice-common/types/form';

export interface IResponse<DataType> {
	data: DataType;
	success: boolean;
}

export interface IListResponseData<T = Record<string, unknown>> {
	docs: T[];
	limit: number;
	page: number;
	totalPage: number;
	total?: number;
	[key: string]: unknown;
}

// biome-ignore lint/suspicious/noExplicitAny: TODO: fix type
export interface IListResponse<T = any>
	extends IResponse<IListResponseData<T>> {}

export interface IFormSubmitResponse extends IResponse<string> {}

export type ResourceAction =
	| 'create'
	| 'update'
	| 'delete'
	| 'list'
	| 'get'
	| '*';

export interface IColumn {
	key: string;
	label: string;
	type: FieldType;
	renderType: RenderType;
}

export interface IReference {
	name: string;
	code: string;
	parent: string;
	isLeaf: boolean;
}

// biome-ignore lint/suspicious/noExplicitAny: TODO: Fix type
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

// biome-ignore lint/suspicious/noExplicitAny: TODO: use type
export interface IFileUploadResponse extends IResponse<any> {
	status: string;
	result: FileUploadResult[];
}

export interface IMenu {
	name: string;
	icon: {
		type: string;
		value: string;
	};
	localizedNames: {
		[key: string]: string;
	};
	resource: string;
	path?: string;
	children?: IMenu[];
}
