import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Navbar() {
    const { isLoggedIn, userRole, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">DentalAppointments</Link>
            </div>
            <ul className="navbar-links">
                {isLoggedIn ? (
                    <>
                        {userRole === 'PATIENT' && (
                            <>
                                <li><Link to="/patient/dashboard">Dashboard</Link></li>
                                <li><Link to="/patient/appointments">My Appointments</Link></li>
                                <li><Link to="/patient/book-appointment">Book Now</Link></li>
                            </>
                        )}
                        {userRole === 'DENTIST' && (
                            <>
                                <li><Link to="/dentist/dashboard">Dashboard</Link></li>
                                <li><Link to="/dentist/schedule">View Schedule</Link></li>
                                <li><Link to="/dentist/manage-availability">Manage Availability</Link></li>
                            </>
                        )}
                        <li><span className="navbar-user">Welcome, {user?.username}</span></li>
                        <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
