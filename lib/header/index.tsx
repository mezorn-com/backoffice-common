import * as React from 'react';
import { Burger, Text, useMantineTheme, Button, Menu, AppShell } from '@mantine/core';
import useStore from '../../../store';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '@/config';
import classes from './Header.module.scss';

interface IHeaderProps {
    opened: boolean;
    setOpened: (opened: any) => void;
}

const Header = ({
    opened,
    setOpened
}: IHeaderProps) => {

    const theme = useMantineTheme();
    const clearStore = useStore(state => state.clearStore);
    const userName = useStore(state => state.auth.name);
    const { t } = useTranslation();

    return (
       <AppShell.Header h={50} p="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <div className={classes.burger}>
                    <Burger
                        opened={!opened}
                        onClick={() => setOpened((o: boolean) => !o)}
                        size="sm"
                        color={theme.colors.gray[6]}
                        mr="xl"
                    />
                </div>

                <div className={classes.container}>
                    <Text>{APP_NAME}</Text>
                    <div>
                        <Menu shadow="md" width={200} position='bottom-end'>
                            <Menu.Target>
                                <Button variant='outline' radius={'md'} size='compact-md'>{userName}</Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item onClick={clearStore}>{t('logout', { ns: 'auth' })}</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </div>
                </div>
            </div>
        </AppShell.Header>
    );
};

export default Header;