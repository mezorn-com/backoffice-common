import * as React from 'react';
import { Route, Routes, useLocation, useNavigate, matchRoutes } from 'react-router-dom';
import authRoutes from '@/routes/AuthRoutes';

const AuthRouter = () => {

    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        const matchedRoutes = matchRoutes(authRoutes, location.pathname);
        if (!matchedRoutes || matchedRoutes.length === 0) {
            navigate('/', {
                replace: true
            });
        }
    }, [location.pathname, navigate]);

    return (
        <Routes>
            {
                authRoutes.map(route => {
                    return (
                        <Route key={route.path} path={route.path} element={route.element}/>
                    )
                })
            }
        </Routes>
    );
};

export default AuthRouter;