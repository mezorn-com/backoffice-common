import { showNotification } from '@mantine/notifications';
import type { MantineColor } from '@mantine/core';

export const showMessage = (message: string, color: MantineColor = 'red') => {
    showNotification({
        title: message,
        message: null,
        color
    })
}
