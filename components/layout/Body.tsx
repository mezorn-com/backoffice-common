import * as React from 'react';
import { createStyles } from '@mantine/core';

const useStyles = createStyles(() => {
    return {
        wrapper: {
            overflow: 'auto',
            flex: 1
        }
    }
})

const Body = ({
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {

    const { classes } = useStyles();

    return (
        <div className={classes.wrapper} {...props}>
            {children}
        </div>
    )
};

export default Body;