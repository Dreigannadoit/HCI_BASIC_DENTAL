import React, { useState, useEffect, useCallback } from 'react';
import { getPatientUpcomingAppointments, cancelPatientAppointment } from '../services/patientService';
import AppointmentList from '../components/Patient/AppointmentList';
import LoadingSpinner from '../components/Common/LoadingSpinner';

function PatientAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getPatientUpcomingAppointments();
            setAppointments(data);
        } catch (err) {
            setError('Failed to load appointments.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleCancel = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            setLoading(true); // Optional: show loading during cancel
            try {
                await cancelPatientAppointment(appointmentId);
                alert('Appointment cancelled successfully.');
                // Refresh the list after cancelling
                fetchAppointments();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to cancel appointment.');
                console.error(err);
                setLoading(false);
            }
            // No finally setLoading(false) here if fetchAppointments handles it
        }
    };

    return (
        <div>
            <h2>My Appointments</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <LoadingSpinner />}
            {!loading && <AppointmentList appointments={appointments} onCancelAppointment={handleCancel} />}
        </div>
    );
}

export default PatientAppointmentsPage;