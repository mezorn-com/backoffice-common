import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';
import classes from './404.module.scss';

const NotFound = () => {

    const  { t } = useTranslation();

    const handleHomeClick = () => {
        window.location.href = '/';
    }

    return (
        <div className={classes.body}>
            <div className={classes.wrapper}>
                <div className={classes.notFound}>
                    404
                </div>
                <div className={classes.title}>
                    {t('404.title', { ns: 'common' })}
                </div>
                <Button
                    mt={120}
                    leftSection={<IconHome/>}
                    onClick={handleHomeClick}
                >
                    {t('action.backHome', { ns: 'common' })}!
                </Button>
            </div>
        </div>
    );
};

export default NotFound;