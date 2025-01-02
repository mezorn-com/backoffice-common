import type { ListItemActionKey } from '@/backoffice-common/types/api/meta';
import type { MantineColor } from '@mantine/core';

export const actionColors: Record<ListItemActionKey, MantineColor> = {
	update: 'yellow',
	get: 'blue',
	delete: 'red'
};
