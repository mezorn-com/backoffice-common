import { IconFileX } from '@tabler/icons-react';
import classes from './Placeholder.module.scss';

const Placeholder = () => {
	return (
		<div className={classes.placeholder}>
			<IconFileX size={100} stroke={1} />
			Өгөгдөл олдсонгүй!
		</div>
	);
};

export default Placeholder;
