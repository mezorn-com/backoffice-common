import * as React from 'react';
import { createStyles } from '@mantine/core';
const useStyles = createStyles((theme) => {
	return {
		placeholder: {
			textAlign: 'center',
			padding: '2rem',
			fontSize: 18,
			fontWeight: 600,
			color: theme.colors[theme.primaryColor][6],
			background: theme.colors.gray[0],
		}
	}
})

const Placeholder = () => {
	const { classes } = useStyles();
	return (
		<div className={classes.placeholder}>
			Өгөгдөл олдсонгүй!
		</div>
	)
};

export default Placeholder;