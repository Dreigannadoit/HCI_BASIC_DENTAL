import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from 'date-fns'; // For setting default end date

import { getDentistSchedule, deleteDentistAppointment } from '../services/dentistService';
import ScheduleView from '../components/Dentist/ScheduleView';
import LoadingSpinner from '../components/Common/LoadingSpinner';

function DentistSchedulePage() {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(addDays(new Date(), 7)); // Default to a week view
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSchedule = useCallback(async () => {
        if (!startDate || !endDate) return;
        setLoading(true);
        setError('');
        try {
            const data = await getDentistSchedule(startDate, endDate);
            setSchedule(data);
        } catch (err) {
            setError('Failed to load schedule.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]); // Dependency array

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]); // Fetch when callback changes (i.e., dates change)

    const handleDelete = async (appointmentId) => {
        if (window.confirm('Are you sure you want to delete this appointment? This cannot be undone.')) {
             setLoading(true); // Show loading during deletion
            try {
                await deleteDentistAppointment(appointmentId);
                alert('Appointment deleted successfully.');
                fetchSchedule(); // Refresh schedule
            } catch (err) {
                 setError(err.response?.data?.message || 'Failed to delete appointment.');
                 console.error(err);
                 setLoading(false); // Stop loading only on error here
            }
            // setLoading(false) is handled by fetchSchedule in success case
        }
    };

    return (
        <div>
            <h2>View Schedule</h2>
            <div className="date-range-picker">
                <div>
                    <label>Start Date: </label>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} dateFormat="MMMM d, yyyy"/>
                </div>
                 <div>
                    <label>End Date: </label>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} dateFormat="MMMM d, yyyy"/>
                </div>
                {/* <button onClick={fetchSchedule} disabled={loading}>Load Schedule</button> */} {/* Fetch on date change instead */}
            </div>

             {error && <p style={{ color: 'red' }}>{error}</p>}
             {loading && <LoadingSpinner message="Loading schedule..." />}
             {!loading && <ScheduleView schedule={schedule} onDeleteAppointment={handleDelete} />}
        </div>
    );
}

export default DentistSchedulePage;