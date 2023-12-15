import * as React from 'react';
import SubHeader from './SubHeader';
import Body from './Body';
import classes from './Layout.module.scss';

const Page = ({
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {

    return (
        <div className={classes.pageWrapper} {...props}>
            {children}
        </div>
    )
};

Page.Header = SubHeader;
Page.Body = Body;

export default Page;