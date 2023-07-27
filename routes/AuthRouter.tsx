import * as React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import authRoutes from '@/routes/AuthRoutes';

const AuthRouter = () => {

    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (location.pathname !== '/') {
            navigate('/', {
                replace: true
            });
        }
    }, [location.pathname]);

    return (
        <Routes>
            {
                authRoutes.map(route => {
                    return (
                        <Route path={route.path} element={route.element}/>
                    )
                })
            }
        </Routes>
    );
};

export default AuthRouter;