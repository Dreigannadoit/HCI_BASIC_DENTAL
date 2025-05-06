import React from 'react';
import { formatReadableDateTime } from '../../util/dateFormatter';

function AppointmentDetailCard({ appointment, onDelete }) {
    const { id, patientName, appointmentDateTime } = appointment;

    return (
        <div className="appointment-detail-card">
            <p><strong>Patient:</strong> {patientName}</p>
            <p><strong>Time:</strong> {formatReadableDateTime(appointmentDateTime)}</p>
            <button onClick={() => onDelete(id)} className="delete-button">
                Delete Appointment
            </button>
        </div>
    );
}

export default AppointmentDetailCard;