import * as React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from '@/backoffice-common/pages/auth/Login';

const AuthRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
        </Routes>
    )
}

export default AuthRoutes;