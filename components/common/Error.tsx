import * as React from 'react';
import { Button, Text } from '@mantine/core';
import { IconHome, IconReload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import classes from './Error.module.scss';

const ErrorPage = () => {

    const { t } = useTranslation();

    const handleReload = () => {
        window.location.reload()
    }

    const handleBackHome = () => {
        window.location.href = '/';
    }

    return (
        <div className={classes.body}>
            <div>
                <Text fz={40} fw={700} mb={100} ta={'center'}>
                    {t('error.title', { ns: 'common' })}!
                </Text>
                <div className={classes.buttons}>
                    <Button
                        color='yellow'
                        leftSection={<IconReload/>}
                        onClick={handleReload}
                    >
                        {t('action.reload', { ns: 'common' })}!
                    </Button>
                    <Button
                        color='cyan'
                        leftSection={<IconHome/>}
                        onClick={handleBackHome}
                    >
                        {t('action.backHome', { ns: 'common' })}!
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage;