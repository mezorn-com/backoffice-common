import type { HTMLAttributes } from 'react';
import classes from './Layout.module.scss';

const Body = ({
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {

    return (
        <div className={classes.bodyWrapper} {...props}>
            {children}
        </div>
    )
};

export default Body;