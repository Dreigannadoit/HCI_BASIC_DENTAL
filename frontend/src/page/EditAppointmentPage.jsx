import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from 'date-fns';

import {
    getAvailableDentists,
    getDentistAvailability,
    getAppointmentByIdForPatient, // Or fetch list and find
    updatePatientAppointment
} from '../services/patientService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import DentistAvailability from '../components/Patient/DentistAvailability';
import { isPastAppointment } from '../util/dateFormatter';


function EditAppointmentPage() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState('');
    const [selectedDate, setSelectedDate] = useState(null); // Start null until data loaded
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(''); // Full ISO dateTime string
    const [initialAppointment, setInitialAppointment] = useState(null);

    const [loading, setLoading] = useState(true); // Loading initial data
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEditable, setIsEditable] = useState(false);


    // Fetch dentists and existing appointment data
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setError('');
            try {
                const dentistsData = await getAvailableDentists();
                setDentists(dentistsData);

                // Fetch the specific appointment
                // OPTION 1: Specific Endpoint (Preferred if available)
                const appData = await getAppointmentByIdForPatient(appointmentId);

                // OPTION 2: Fetch upcoming and filter (Less efficient if list is large)
                // const upcoming = await getPatientUpcomingAppointments();
                // const appData = upcoming.find(app => String(app.id) === appointmentId);

                if (!appData) {
                    throw new Error("Appointment not found.");
                }

                if (isPastAppointment(appData.appointmentDateTime)) {
                    setError("Cannot edit past appointments.");
                    setIsEditable(false);
                } else {
                    setIsEditable(true);
                    setInitialAppointment(appData);
                    setSelectedDentist(appData.dentistId);
                    const initialDate = parseISO(appData.appointmentDateTime);
                    setSelectedDate(initialDate);
                    setSelectedSlot(appData.appointmentDateTime); // Pre-select the current slot
                }

            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load appointment data.');
                console.error(err);
                setIsEditable(false);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [appointmentId]);

    // Fetch availability when dentist or date changes *after* initial load
    useEffect(() => {
        // Only fetch if initial data is loaded and editable, and dentist/date are set
        if (!loading && isEditable && selectedDentist && selectedDate) {
            const fetchAvailability = async () => {
                setAvailabilityLoading(true);
                setTimeSlots([]);
                // Don't reset selectedSlot if date/dentist haven't changed from initial
                if (initialAppointment &&
                    selectedDentist === initialAppointment.dentistId &&
                    format(selectedDate, 'yyyy-MM-dd') === format(parseISO(initialAppointment.appointmentDateTime), 'yyyy-MM-dd')
                    ) {
                     // Keep initial slot selected if on the same day/dentist
                } else {
                     setSelectedSlot(''); // Reset slot if dentist or date changes
                }

                try {
                    const dateString = format(selectedDate, 'yyyy-MM-dd');
                    const availabilityData = await getDentistAvailability(selectedDentist, dateString);
                    setTimeSlots(availabilityData);
                } catch (err) {
                    setError('Failed to load availability.');
                    console.error(err);
                } finally {
                    setAvailabilityLoading(false);
                }
            };
            fetchAvailability();
        }
    }, [selectedDentist, selectedDate, loading, isEditable, initialAppointment]);


    const handleUpdate = async () => {
        if (!selectedDentist || !selectedSlot) {
            setError('Please select a dentist and a time slot.');
            return;
        }
        if (!isEditable) {
             setError('This appointment cannot be edited.');
             return;
        }

        setSubmitLoading(true);
        setError('');
        try {
            await updatePatientAppointment(appointmentId, {
                dentistId: selectedDentist,
                appointmentDateTime: selectedSlot,
            });
            alert('Appointment updated successfully!');
            navigate('/patient/appointments');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed. The slot may have just been taken.');
            console.error(err);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading appointment details..." />;
    if (!isEditable && !error) return <p>This appointment cannot be edited.</p>; // Handle non-editable state

    return (
        <div>
            <h2>Edit Appointment</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {initialAppointment && (
                <p>Current: Dr. {initialAppointment.dentistName} on {formatReadableDateTime(initialAppointment.appointmentDateTime)}</p>
            )}

            {isEditable && (
                <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                     <div>
                        <label htmlFor="dentist-select">Choose a Dentist:</label>
                        <select
                            id="dentist-select"
                            value={selectedDentist}
                            onChange={(e) => setSelectedDentist(e.target.value)}
                            disabled={!dentists.length || submitLoading}
                        >
                            <option value="">-- Select a Dentist --</option>
                            {dentists.map((dentist) => (
                                <option key={dentist.id} value={dentist.id}>
                                    {dentist.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedDentist && selectedDate && (
                        <>
                            <div>
                                <label>Select Date:</label>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    minDate={new Date()}
                                    dateFormat="MMMM d, yyyy"
                                    disabled={submitLoading}
                                />
                            </div>

                            <DentistAvailability
                                slots={timeSlots}
                                selectedSlot={selectedSlot}
                                onSelectSlot={setSelectedSlot}
                                loading={availabilityLoading}
                                selectedDate={selectedDate}
                            />
                        </>
                    )}

                    <button type="submit" disabled={!selectedSlot || submitLoading || availabilityLoading}>
                        {submitLoading ? 'Updating...' : 'Confirm Update'}
                    </button>
                    <button type="button" onClick={() => navigate('/patient/appointments')} disabled={submitLoading} style={{marginLeft: '10px'}}>
                        Cancel
                    </button>
                </form>
             )}
        </div>
    );
}
export default EditAppointmentPage;