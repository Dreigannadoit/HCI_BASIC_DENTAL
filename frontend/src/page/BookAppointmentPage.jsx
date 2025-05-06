import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from 'date-fns'; // For date manipulation

import { getAvailableDentists, getDentistAvailability, bookNewAppointment } from '../services/patientService';
import LoadingSpinner from '../components/Common/LoadingSpinner';

function BookAppointmentPage() {
    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]); // [{ dateTime: "ISOString", available: true/false }]
    const [selectedSlot, setSelectedSlot] = useState(''); // The full ISO dateTime string of the chosen slot
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDentists = async () => {
            setIsLoading(true);
            try {
                const data = await getAvailableDentists();
                setDentists(data);
            } catch (err) {
                setError('Failed to load dentists.');
                console.error(err);
            }
            setIsLoading(false);
        };
        fetchDentists();
    }, []);

    useEffect(() => {
        if (selectedDentist && selectedDate) {
            const fetchAvailability = async () => {
                setIsLoading(true);
                setTimeSlots([]); // Clear previous slots
                setSelectedSlot('');
                try {
                    const dateString = format(selectedDate, 'yyyy-MM-dd');
                    const availabilityData = await getDentistAvailability(selectedDentist, dateString);
                    setTimeSlots(availabilityData);
                } catch (err) {
                    setError('Failed to load availability.');
                    console.error(err);
                }
                setIsLoading(false);
            };
            fetchAvailability();
        }
    }, [selectedDentist, selectedDate]);

    const handleBooking = async () => {
        if (!selectedDentist || !selectedSlot) {
            setError('Please select a dentist and a time slot.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await bookNewAppointment({
                dentistId: selectedDentist,
                appointmentDateTime: selectedSlot, // This is already the ISO string
            });
            alert('Appointment booked successfully!');
            navigate('/patient/appointments');
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. The slot may have just been taken.');
            console.error(err);
        }
        setIsLoading(false);
    };

    if (isLoading && !dentists.length) return <LoadingSpinner message="Loading dentists..." />;

    return (
        <div>
            <h2>Book an Appointment</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <label htmlFor="dentist-select">Choose a Dentist:</label>
                <select
                    id="dentist-select"
                    value={selectedDentist}
                    onChange={(e) => setSelectedDentist(e.target.value)}
                    disabled={!dentists.length}
                >
                    <option value="">-- Select a Dentist --</option>
                    {dentists.map((dentist) => (
                        <option key={dentist.id} value={dentist.id}>
                            {dentist.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedDentist && (
                <>
                    <div>
                        <label>Select Date:</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            minDate={new Date()} // Prevent booking past dates
                            dateFormat="MMMM d, yyyy"
                        />
                    </div>

                    {isLoading && timeSlots.length === 0 && <LoadingSpinner message="Fetching availability..." />}

                    {timeSlots.length > 0 && (
                        <div>
                            <h3>Available Slots for {format(selectedDate, 'MMMM d, yyyy')}:</h3>
                            {timeSlots.filter(slot => slot.available).length === 0 && !isLoading && <p>No available slots for this day.</p>}
                            <div className="time-slots-container"> {/* Style this for button layout */}
                                {timeSlots
                                    .filter(slot => slot.available)
                                    .map((slot) => (
                                        <button
                                            key={slot.dateTime}
                                            onClick={() => setSelectedSlot(slot.dateTime)}
                                            className={selectedSlot === slot.dateTime ? 'selected' : ''}
                                            style={{ margin: '5px', padding: '10px' }} // Basic styling
                                        >
                                            {format(parseISO(slot.dateTime), 'p')} {/* Format to '10:00 AM' */}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {selectedSlot && (
                <button onClick={handleBooking} disabled={isLoading} style={{ marginTop: '20px' }}>
                    {isLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
            )}
        </div>
    );
}

export default BookAppointmentPage;