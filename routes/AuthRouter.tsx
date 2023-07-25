import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { USE_CUSTOM_AUTH_ROUTES } from '@/config';

const DynamicRouter = React.lazy(() => {
    if (USE_CUSTOM_AUTH_ROUTES) {
        return import(`../../routes/AuthRoutes.tsx`).catch(e => {
            console.error('Error trying to import custom auth routes. Make sure your routes file is in "/src/routes/AuthRoutes.tsx:" directory: ', e.message);
            return import('./DefaultAuthRoutes.tsx');
        });
    }
    return import('./DefaultAuthRoutes.tsx');
});

const AuthRouter = () => {

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // return navigate maybe
        if (location.pathname !== '/') {
            navigate('/', {
                replace: true
            });
        }
    }, [location.pathname]);

    return (
        <DynamicRouter/>
    );
};

export default AuthRouter;