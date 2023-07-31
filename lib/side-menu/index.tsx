import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ActionIcon, Avatar, Burger, createStyles, Flex, MediaQuery, Menu, Navbar, NavLink, Title, useMantineTheme } from '@mantine/core';
import useStore from '@/store';
import routes from '@/routes';
import { useTranslation } from 'react-i18next';
import { IconBuilding, IconSettings, IconUser } from '@tabler/icons-react';
import { APP_NAME } from '@/config';
import { IRoute } from '@/backoffice-common/types';

interface SideMenuProps {
    opened: boolean;
    setOpened: (opened: any) => void;
}

const getRouteObjectByPath = (path: string): IRoute | undefined  => {
    return routes.find(route => route.path === path);
}

const SideMenu = ({
    opened, setOpened
}: SideMenuProps) => {

    const { classes } = useStyles();
    const theme = useMantineTheme();
    const location = useLocation();
    const menu = useStore(state => state.auth.sideMenu);
    const userName = useStore(state => state.auth.name);
    const clearStore = useStore(state => state.clearStore);
    const { t, i18n  } = useTranslation();

    const currentRoute = React.useMemo(() => {
        const routeObject = getRouteObjectByPath(location.pathname);
        if (routeObject) {
            return routeObject;
        }

        const splitPath = location.pathname.split('/').reverse();
        let pathname = location.pathname;
        for (const urlPart of splitPath) {
            // adding 1 because forward slash has to be removed too.
            pathname = pathname.slice(0, -1 * (1 + urlPart.length));
            if (pathname) {
                const ro = getRouteObjectByPath(pathname);
                if (ro) {
                    return ro;
                }
            }
        }
        return undefined;
    }, [location.pathname]);

    return (
        <Navbar
            hiddenBreakpoint="sm"
            hidden={opened}
            width={{ sm: 260 }}
        >
            <Navbar.Section>
                <div className={classes.mobileBurgerContainer}>
                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                        <Burger 
                            opened={!opened}
                            onClick={() => setOpened((o: boolean) => !o)}
                            size="sm"
                            color={theme.colors.gray[6]}
                        />
                    </MediaQuery>
                    <Flex 
                        justify="center"
                        align="center"
                        direction="row"
                        gap="sm"
                    >
                        <Avatar radius={'xl'}>
                            <IconUser/>
                        </Avatar>
                        <Title order={6}>
                            {userName}
                        </Title>
                    </Flex>
                    <Menu shadow="md" width={200} position='bottom-end'>
                        <Menu.Target>
                           <ActionIcon size={'lg'} variant={'light'}>
                                <IconSettings/>
                           </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item onClick={clearStore}>{t('logout', { ns: 'auth' })}</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            </Navbar.Section>
           
           <Navbar.Section grow>
                <div className={classes.menus}>
                    {
                        menu.map(menuItem => {
                            const menuKey = menuItem?.resource ?? menuItem?.path;
                            const isActive = currentRoute?.key === menuKey || currentRoute?.menuKey === menuKey;
                            const menuItemRoute = routes.find(route => route.key === menuKey);
                            const path = menuItemRoute?.path ?? '404';
                            const redirectPath = path.endsWith('/*') ? path.slice(0, -2) : path;
                            const label = menuItem?.localizedNames?.[i18n?.language] ?? menuItem.name;
                            return (
                                <NavLink
                                    active={isActive}
                                    key={menuKey}
                                    label={label}
                                    component={Link}
                                    to={redirectPath}
                                    icon={<IconBuilding size={16}/>}
                                    classNames={{
                                        root: classes.menuItem
                                    }}
                                />
                            )
                        })
                    }
                </div>
           </Navbar.Section>
           <Navbar.Section >
                <div className={classes.logo}>
                    <div>
                        {APP_NAME}
                    </div>
                    <div className={classes.divider}/>
                    <div className={classes.headerText}>
                        OFFICE
                    </div>
                    <div className={classes.version}>
                        {/*v1.3.5*/}
                    </div>
                </div>
           </Navbar.Section>
        </Navbar>
    );
};

const useStyles = createStyles((theme,  _params, getRef) => {
    return {
        mobileBurgerContainer: {
            flex: 1,
            display: 'flex',
            padding: '7px',
            borderBottom: '1px solid ' + theme.colors.gray[2],
            justifyContent: 'space-between',
            alignItems: 'center',

            [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                // Type safe child reference in nested selectors via ref
                padding: '10px 7px',
            },
        },
        menus:{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            padding: '15px 0px',

            [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                // Type safe child reference in nested selectors via ref
                padding: '5px 0px',
            },
        },
        logo: {
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            padding: '20px',
            flexDirection: 'row',
            justifyContent: 'center'
        },
        menuItem: {
            color: theme.colors.gray[6],
            fontWeight: 500
        },
        headerText: {
            fontWeight: 500,
            fontSize: 16
        },
        divider: {
            borderRight: '1px solid black',
            alignSelf: 'stretch'
        },
        version: {
            borderRadius: '15px',
            background: '#F1F3F5',
            padding: '.3rem .8rem',
            fontSize: 12,
            color: '#8E8E8F',
            fontWeight: 600
        },

    }
 });

export default SideMenu;