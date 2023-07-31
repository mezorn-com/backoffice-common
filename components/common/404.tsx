import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { createStyles, Button } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';

const useStyles = createStyles((theme) => {
    return {
        body: {
            flex: 1,
            display: 'grid',
            placeItems: 'center'
        },
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: theme.colors.gray[1],
            padding: 100,
            borderRadius: theme.radius.lg
        },
        404: {
            fontSize: 100,
            fontWeight: 800,
            color: theme.colors[theme.primaryColor],
            lineHeight: 1
        },
        title: {
            fontSize: 40,
            fontWeight: 600,
            color: theme.colors.gray[7]
        }
    }
})

const NotFound = () => {

    const  { t } = useTranslation();
    const { classes } = useStyles();

    const handleHomeClick = () => {
        window.location.href = '/';
    }

    return (
        <div className={classes.body}>
            <div className={classes.wrapper}>
                <div className={classes['404']}>
                    404
                </div>
                <div className={classes.title}>
                    {t('404.title', { ns: 'common' })}
                </div>
                <Button
                    mt={120}
                    leftIcon={<IconHome/>}
                    onClick={handleHomeClick}
                >
                    {t('action.backHome', { ns: 'common' })}!
                </Button>
            </div>
        </div>
    );
};

export default NotFound;