import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from '@/backoffice-common/pages/auth/Login';

const AuthRoutes = () => {

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname !== '/') {
            navigate('/', {
                replace: true
            });
        }
    }, [location.pathname]);

    return (
        <Routes>
            <Route path='/' element={<Login />} />
        </Routes>
    )
};

export default AuthRoutes;