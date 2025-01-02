import type { KeyboardEvent } from 'react';

// biome-ignore lint/complexity/noBannedTypes: Global function type needed
export const buttonize = (handler: Function) => {
	return {
		role: 'button',
		onClick: handler,
		onKeyDown: (event: KeyboardEvent) => {
			if (event.key === 'Enter' || event.key === ' ') {
				handler();
			}
		}
	} as const;
};
