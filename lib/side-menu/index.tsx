import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { AppShell, ScrollArea } from '@mantine/core';
import useStore from '@/store';
import routes from '@/routes';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '@/config';
import { IRoute } from '@/backoffice-common/types';
import type { IMenu } from '@/store/types';
import NavbarItem from '@/backoffice-common/lib/side-menu/NavbarItem';
import classes from './SideMenu.module.scss';
import Profile from '@/backoffice-common/components/profile';

const getRouteObjectByPath = (path: string): IRoute | undefined  => {
    return routes.find(route => route.path === path);
}

const SideMenu = () => {

    const location = useLocation();
    const menu = useStore(state => state.auth.sideMenu);
    const { i18n  } = useTranslation();

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

    const getIsActive = (menuKey: string) => {
        return currentRoute?.key === menuKey || currentRoute?.menuKey === menuKey;
    }

    const getMenuKey = (menuItem: IMenu) => menuItem?.resource ?? menuItem?.path;

    const getNavbarItem = (menuItem: IMenu, index: number): React.ReactNode => {
        const children = (menuItem.children ?? []).map(getNavbarItem);
        const hasActiveChild = (menuItem.children ?? []).some((item) => {
            const key = getMenuKey(item);
            return getIsActive(key);
        });
        const menuKey = getMenuKey(menuItem);
        const menuItemRoute = routes.find(route => route.key === menuKey);
        const path = menuItemRoute?.path ?? '404';
        const redirectPath = path.endsWith('/*') ? path.slice(0, -2) : path;
        const label = menuItem?.localizedNames?.[i18n?.language] ?? menuItem.name;

        const isActive = children.length ? hasActiveChild : getIsActive(menuKey);

        return (
            <NavbarItem
                key={index}
                children={children}
                label={label}
                isActive={isActive}
                path={redirectPath}
                icon={menuItem.icon.value}
            />
        )
    }

    return (
        <AppShell.Navbar>
            <AppShell.Section visibleFrom='sm' className={classes.navbarHeader}>
                <Profile/>
            </AppShell.Section>
           
           <AppShell.Section grow component={ScrollArea}>
                <div className={classes.menus}>
                    {
                        menu.map(getNavbarItem)
                    }
                </div>
           </AppShell.Section>
           <AppShell.Section >
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
           </AppShell.Section>
        </AppShell.Navbar>
    );
};

export default SideMenu;