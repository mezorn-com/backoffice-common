import type { MantineColor } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

export const showMessage = (message: string, color: MantineColor = 'red') => {
	showNotification({
		title: message,
		message: null,
		color,
	});
};
