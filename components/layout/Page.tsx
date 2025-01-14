import type { HTMLAttributes } from 'react';

import Body from './Body';
import classes from './Layout.module.scss';
import SubHeader from './SubHeader';

const Page = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={classes.pageWrapper} {...props}>
			{children}
		</div>
	);
};

Page.Header = SubHeader;
Page.Body = Body;

export default Page;
