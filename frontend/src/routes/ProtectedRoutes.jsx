import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/Common/LoadingSpinner'; // Assuming you have this

const ProtectedRoute = ({ allowedRoles }) => {
    const { isLoggedIn, userRole, isLoading } = useAuth(); // Using derived userRole
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner message="Verifying access..." />;
    }

    if (!isLoggedIn) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // User is logged in but doesn't have the required role
        console.warn(`Access denied for role: ${userRole}. Allowed: ${allowedRoles.join(', ')}`);
        // Redirect to a generic dashboard or home page, or a specific "Unauthorized" page
        // Avoid redirecting back to 'from' if 'from' was the forbidden page itself, causing a loop
        return <Navigate to={userRole === 'PATIENT' ? '/patient/dashboard' : '/dentist/dashboard'} replace />;
    }

    // User is logged in and has the required role (or no specific role is required)
    return <Outlet />; // Render the child route component
};

export default ProtectedRoute;