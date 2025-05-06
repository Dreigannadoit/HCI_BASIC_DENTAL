import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
    const { isLoggedIn, userRole } = useAuth();

    return (
        <div>
            <h1>Welcome to Dental Appointments</h1>
            <p>Your smile is our priority.</p>
            {!isLoggedIn ? (
                <p>Please <Link to="/login">Login</Link> or <Link to="/register">Register</Link> to continue.</p>
            ) : (
                <p>
                    {userRole === 'PATIENT' && <Link to="/patient/dashboard">Go to Patient Dashboard</Link>}
                    {userRole === 'DENTIST' && <Link to="/dentist/dashboard">Go to Dentist Dashboard</Link>}
                </p>
            )}
        </div>
    );
}
export default HomePage;