import { produce } from 'immer';

import type { IState } from '../types';
import type { Action } from './action-types';

export const initialState: IState = {
	visibleKeys: []
};

// biome-ignore lint/correctness/noUnusedVariables: TODO: remove
export const reducer = produce((draft: IState, action: Action) => {
	switch (action.type) {
		case 'SET_VISIBLE_KEYS': {
			break;
		}

		default:
			break;
	}
});
