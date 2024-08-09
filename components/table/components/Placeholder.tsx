import * as React from 'react';
import classes from './Placeholder.module.scss';
import { IconFileX, IconFileXFilled } from '@tabler/icons-react';
import { useMantineTheme } from '@mantine/core';

const Placeholder = () => {
	const theme = useMantineTheme();

	return (
		<div className={classes.placeholder}>
			<IconFileX size={100} stroke={1}/>
			Өгөгдөл олдсонгүй!
		</div>
	)
};

export default Placeholder;