import authRoutes from '@/routes/AuthRoutes';
import * as React from 'react';
import {
	Route,
	Routes,
	matchRoutes,
	useLocation,
	useNavigate,
} from 'react-router-dom';

const AuthRouter = () => {
	const location = useLocation();
	const navigate = useNavigate();

	React.useEffect(() => {
		const matchedRoutes = matchRoutes(authRoutes, location.pathname);
		if (!matchedRoutes || matchedRoutes.length === 0) {
			navigate('/', {
				replace: true,
			});
		}
	}, [location.pathname, navigate]);

	return (
		<Routes>
			{authRoutes.map(route => {
				return (
					<Route
						key={route.path}
						path={route.path}
						element={route.element}
					/>
				);
			})}
		</Routes>
	);
};

export default AuthRouter;
