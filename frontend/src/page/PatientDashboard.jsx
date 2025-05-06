import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function PatientDashboard() {
     const { user } = useAuth();
    return (
        <div>
            <h2>Patient Dashboard</h2>
            <p>Welcome back, {user?.username}!</p>
            <ul>
                <li><Link to="/patient/appointments">View My Appointments</Link></li>
                <li><Link to="/patient/book-appointment">Book a New Appointment</Link></li>
            </ul>
        </div>
    );
}
export default PatientDashboard;