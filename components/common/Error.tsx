import * as React from 'react';
import { Button, createStyles, Text } from '@mantine/core';
import { IconHome, IconReload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const useStyles = createStyles((theme) => {
    return {
        body: {
            height: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: theme.colors.cyan[0]
        },
        buttons: {
            display: 'flex',
            gap: '1rem',
        }
    }
})

const ErrorPage = () => {

    const { classes } = useStyles();
    const { t } = useTranslation();

    return (
        <div className={classes.body}>
            <div>
                <Text fz={40} fw={700} mb={100} ta={'center'}>
                    {t('error.title', { ns: 'common' })}!
                </Text>
                <div className={classes.buttons}>
                    <Button
                        color='yellow'
                        leftIcon={<IconReload/>}
                    >
                        {t('action.reload', { ns: 'common' })}!
                    </Button>
                    <Button
                        color='cyan'
                        leftIcon={<IconHome/>}
                    >
                        {t('action.backHome', { ns: 'common' })}!
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage;