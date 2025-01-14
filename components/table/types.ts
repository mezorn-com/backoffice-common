import type { Dispatch } from 'react';

import type { ActionButtonProps } from '@/backoffice-common/components/common/action-button';
import type { Action } from '@/backoffice-common/hooks/useListPage';
import type { IListState } from '@/backoffice-common/types/common/list';

export interface ITableState {
	page: number;
	pageSize: number;
	totalPage?: number;
	total?: number;
}

export interface ITableInteraction {
	state: ITableState;
	// biome-ignore lint/suspicious/noExplicitAny: TODO: Fix later
	// eslint-disable-next-line
	filter?: Record<string, any>;
	selectedRows?: string[];
}

export interface ITableProps {
	onInteract: (state: ITableInteraction) => void;
	rowActionButtons?: ActionButtonProps[];
	state: IListState;
	pageSizes?: number[];
	dispatch: Dispatch<Action>;
	hideBulkActions?: boolean;
	bulkActionUrlParser?: (url: string) => string;
}

export enum TableSectionType {
	LEFT = 'left',
	CENTER = 'center',
	RIGHT = 'right'
}

export enum RowGroup {
	HEADER = 'header',
	BODY = 'body',
	FOOTER = 'footer'
}
