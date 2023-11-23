import * as React from 'react';
import { createStyles, rem } from '@mantine/core';

const useStyles = createStyles(() => {
    return {
        wrapper: {
            overflow: 'auto',
            flex: 1,
            padding: rem(15)
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