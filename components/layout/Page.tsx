import * as React from 'react';
import { createStyles } from '@mantine/core';
import SubHeader from './SubHeader';
import Body from './Body';

const useStyles = createStyles(() => {
    return {
        wrapper: {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
        }
    }
})

const Page = ({
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

Page.Header = SubHeader;
Page.Body = Body;

export default Page;