import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import AppContainer from '@/backoffice-common/components/layout/AppContainer';
import useStore from '@/store';

import routes from '../../routes';

// const standAloneRoutes = routes.filter(route => route.standAlone);

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
				<Route
					key={route.path}
					path={route.path}
					element={<route.element />}
				/>
			);
		}
	}
	return array;
};

const ProtectedRoutes = () => {
	const location = useLocation();
	const sideMenu = useStore(state => state.auth.sideMenu);

	if (location.pathname === '/') {
		const redirectMenuItem = sideMenu?.[0];
		if (redirectMenuItem) {
			const redirectRoute =
				redirectMenuItem.resource ?? redirectMenuItem.path;
			if (redirectRoute) {
				return <Navigate to={redirectRoute} replace={true} />;
			}
		}
	}

	if (location.pathname.endsWith('/') && location.pathname !== '/') {
		return <Navigate to={location.pathname.slice(0, -1)} replace={true} />;
	}

	return (
		<AppContainer>
			<Routes>{getRoutes()}</Routes>
		</AppContainer>
	);
};

export default ProtectedRoutes;
