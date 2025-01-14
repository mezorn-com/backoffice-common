import type { MantineColor } from '@mantine/core';

import type { ListItemActionKey } from '@/backoffice-common/types/api/meta';

export const actionColors: Record<ListItemActionKey, MantineColor> = {
	update: 'yellow',
	get: 'blue',
	delete: 'red'
};
