import { RoleNotFound, useKeycloak } from '@mezorn-com/mzrn-bo-sso';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import AppContainer from '@/backoffice-common/components/layout/AppContainer';
import { SSO_CLIENT_ID } from '@/config';
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
	console.log('hiiihhihih');
	
	const location = useLocation();
	const sideMenu = useStore(state => state.auth.sideMenu);
	const clearStore = useStore(state => state.clearStore);

	const { keycloak } = useKeycloak();
	
	const roles = keycloak?.tokenParsed?.resource_access[SSO_CLIENT_ID]?.roles;
	console.log(roles, 'roles');

	if (!roles || roles.length === 0) {
		console.log('hiiihhihih');
		return (
			<RoleNotFound onLogout={clearStore}	/>
		);
	}
	
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
