import * as React from 'react';
import classes from './Layout.module.scss';

const Body = ({
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {

    return (
        <div className={classes.bodyWrapper} {...props}>
            {children}
        </div>
    )
};

export default Body;