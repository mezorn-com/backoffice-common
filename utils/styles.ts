import { ListItemActionKey } from '@/backoffice-common/types/api/meta';
import { MantineColor } from '@mantine/core';

export const actionColors: Record<ListItemActionKey, MantineColor> = {
    update: 'yellow',
    get: 'blue',
    delete: 'red',
}