import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || Object.keys(user).length === 0) {
        return <Navigate to="/signup" replace />;
    }

    return children;
};

export default PrivateRoute;
