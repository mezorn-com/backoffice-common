import * as React from 'react';
import { Burger, MediaQuery, Text, Header as MantineHeader, useMantineTheme, Button, createStyles, Menu } from '@mantine/core';
import useStore from '../../../store';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '@/config';

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
    const { classes } = useStyles();
    const { t } = useTranslation();

    return (
       <MantineHeader height={{ base: 50, md: 70 }} p="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Burger
                        opened={!opened}
                        onClick={() => setOpened((o: boolean) => !o)}
                        size="sm"
                        color={theme.colors.gray[6]}
                        mr="xl"
                    />
                </MediaQuery>

                <div className={classes.container}>
                    <Text>{APP_NAME}</Text>
                    <div>
                        <Menu shadow="md" width={200} position='bottom-end'>
                            <Menu.Target>
                                <Button variant='outline' radius={'md'} size={'md'} compact>{userName}</Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item onClick={clearStore}>{t('logout', { ns: 'auth' })}</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </div>
                </div>
            </div>
        </MantineHeader>
    );
};

const useStyles=  createStyles(() => {
   return {
       container: {
           flex: 1,
           display: 'flex',
           justifyContent: 'space-between'
       }
   }
});

export default Header;