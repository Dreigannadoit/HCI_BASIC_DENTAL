import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function DentistDashboard() {
     const { user } = useAuth();
    return (
        <div>
            <h2>Dentist Dashboard</h2>
            <p>Welcome, Dr. {user?.username}!</p>
             <ul>
                <li><Link to="/dentist/schedule">View Schedule</Link></li>
                <li><Link to="/dentist/manage-availability">Manage Availability / Block Slots</Link></li>
            </ul>
        </div>
    );
}
export default DentistDashboard;