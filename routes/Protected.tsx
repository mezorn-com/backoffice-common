import * as React from "react";
import { Routes, Route, useLocation, matchRoutes, useNavigate } from "react-router-dom";
import { AppShell, Burger, createStyles, MediaQuery, useMantineTheme } from '@mantine/core';
import routes from '../../routes';
import Footer from '../lib/footer';
import Header from '../lib/header';
import SideMenu from '../lib/side-menu';

const standAloneRoutes = routes.filter(route => route.standAlone);

const getRoutes = () => {
    const array: JSX.Element[] = [];
    const routeKeys: string[] = [];
    for (const route of routes) {
        if (routeKeys.includes(route.key)) {
            console.error(`Duplicate Route Key: ${route.key}`);
        }
        routeKeys.push(route.key);
        if (route.element) {
            array.push(
                <Route key={route.path} path={route.path} element={<route.element />} />
            )
        }
    }
    return array;
}

const ProtectedRoutes = () => {
    const { classes } = useStyles()
    const location = useLocation();
    const navigate = useNavigate();
    const isStandAlone: boolean = !!matchRoutes(standAloneRoutes, location)?.length;
    const theme = useMantineTheme();

    const [ opened, setOpened ] = React.useState<boolean>(false);

    return (
        <AppShell
            navbarOffsetBreakpoint='sm'
            asideOffsetBreakpoint='sm'
            navbar={<SideMenu opened={opened} setOpened={setOpened}/>}
            // footer={<Footer/>}
            // header={<Header opened={opened} setOpened={setOpened}/>}
            padding={0}
            className={classes.shell}
        >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <div className={classes.mobileBurgerContainer}>
                        <Burger 
                            opened={!opened}
                            onClick={() => setOpened((o: boolean) => !o)}
                            size="sm"
                            color={theme.colors.gray[6]}
                            mr="xl"
                        />
                    </div>
            </MediaQuery>
            <Routes>
                {getRoutes()}
            </Routes>
        </AppShell>
    )
};

const useStyles = createStyles((theme) => {
    return {
        mobileBurgerContainer: {
            flex: 1,
            display: 'flex',
            padding: '10px',
            borderBottom: '1px solid ' + theme.colors.gray[2],
            justifyContent: 'start'
        },
        shell: {
            overflow: 'hidden'
        }
    }
 });

export default ProtectedRoutes;
