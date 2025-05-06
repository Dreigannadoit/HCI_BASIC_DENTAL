import React from 'react';
import AppointmentCard from './AppointmentCard';

function AppointmentList({ appointments, onCancelAppointment }) {
    if (!appointments || appointments.length === 0) {
        return <p>You have no upcoming appointments.</p>;
    }

    return (
        <div className="appointment-list">
            <h3>Your Upcoming Appointments</h3>
            {appointments.map((app) => (
                <AppointmentCard
                    key={app.id}
                    appointment={app}
                    onCancel={onCancelAppointment}
                />
            ))}
        </div>
    );
}

export default AppointmentList;