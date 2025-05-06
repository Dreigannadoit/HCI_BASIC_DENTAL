import React from 'react';
import { Link } from 'react-router-dom';
import { formatReadableDateTime, isPastAppointment } from '../../util/dateFormatter';

function AppointmentCard({ appointment, onCancel }) {
    const { id, dentistName, patientName, appointmentDateTime } = appointment;
    const isPast = isPastAppointment(appointmentDateTime);

    return (
        <div className={`appointment-card ${isPast ? 'past' : 'upcoming'}`}>
            <h4>Appointment with Dr. {dentistName}</h4>
            {/* Only show patient name if needed (e.g., maybe not on patient's own view) */}
            {/* <p>Patient: {patientName}</p> */}
            <p>Date & Time: {formatReadableDateTime(appointmentDateTime)}</p>
            {!isPast && (
                <div className="appointment-actions">
                    <Link to={`/patient/appointment/edit/${id}`}>
                        <button>Edit</button>
                    </Link>
                    <button onClick={() => onCancel(id)} className="cancel-button">
                        Cancel
                    </button>
                </div>
            )}
            {isPast && <p className="status-past">This appointment has passed.</p>}
        </div>
    );
}

export default AppointmentCard;
