import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, setHours, setMinutes, setSeconds, startOfDay, endOfDay, eachHourOfInterval, isBefore } from 'date-fns';

import { getDentistSchedule, getBlockedSlots, blockTimeSlot, unblockTimeSlot } from '../services/dentistService'; // Assumes getBlockedSlots exists
import LoadingSpinner from '../components/Common/LoadingSpinner';

function ManageAvailabilityPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [blockedSlots, setBlockedSlots] = useState([]); // Store ISO strings of blocked slots
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false); // For block/unblock actions
    const [error, setError] = useState('');

    // Define working hours (could come from config/context later)
    const workStartHour = 9;
    const workEndHour = 17; // Exclusive (e.g., 17 means last slot is 4 PM)

    const fetchAvailabilityData = useCallback(async () => {
        if (!selectedDate) return;
        setLoading(true);
        setError('');
        try {
            // Fetch schedule for the single day
            const scheduleData = await getDentistSchedule(selectedDate, selectedDate);
            setAppointments(scheduleData);

            // Fetch blocked slots for the day (NEEDS BACKEND ENDPOINT)
            // const blockedData = await getBlockedSlots(selectedDate); // Replace with actual call
            const blockedData = []; // Placeholder - replace with actual API call result
            setBlockedSlots(blockedData.map(slot => slot.startDateTime)); // Assuming backend returns { startDateTime: "ISOString" }

        } catch (err) {
            setError('Failed to load availability data.');
            console.error(err);
            setAppointments([]);
            setBlockedSlots([]);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchAvailabilityData();
    }, [fetchAvailabilityData]); // Re-fetch when date changes

    const handleSlotAction = async (isoDateTimeString, action) => {
        setActionLoading(true);
        setError('');
        try {
            if (action === 'block') {
                await blockTimeSlot(isoDateTimeString);
            } else if (action === 'unblock') {
                await unblockTimeSlot(isoDateTimeString);
            }
            alert(`Slot ${action === 'block' ? 'blocked' : 'unblocked'} successfully.`);
            fetchAvailabilityData(); // Refresh data after action
        } catch (err) {
             setError(err.response?.data?.message || `Failed to ${action} slot.`);
             console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    // Generate potential time slots for the day
    const generateTimeSlots = () => {
        const slots = [];
        if (!selectedDate) return slots;

        const start = setSeconds(setMinutes(setHours(startOfDay(selectedDate), workStartHour), 0), 0);
        const end = setSeconds(setMinutes(setHours(startOfDay(selectedDate), workEndHour), 0), 0); // End hour is exclusive interval end

         try {
            const hourlySlots = eachHourOfInterval({ start, end });
             // Adjust end if needed. eachHourOfInterval includes start, might exclude end depending on exact time.
             // We want slots *starting* from workStartHour up to (workEndHour - 1)
             // Filter out the end hour itself if included.
             const potentialSlots = hourlySlots.filter(slot => slot.getHours() < workEndHour);

            potentialSlots.forEach(slotTime => {
                const isoString = format(slotTime, "yyyy-MM-dd'T'HH:mm:ss");
                const isBooked = appointments.some(app => app.appointmentDateTime === isoString);
                const isBlocked = blockedSlots.includes(isoString);
                const isPast = isBefore(slotTime, new Date()); // Check if slot start time is in past

                slots.push({
                    iso: isoString,
                    timeLabel: format(slotTime, 'p'),
                    isBooked,
                    isBlocked,
                    isPast,
                });
            });

         } catch(e) {
             console.error("Error generating time slots:", e);
             setError("Error generating time slots for the selected date.");
         }

        return slots;
    };

    const dailySlots = generateTimeSlots();

    return (
        <div>
            <h2>Manage Availability</h2>
            <p>Select a date to view and manage available slots.</p>
            <div>
                <label>Date:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date()} // Can manage future dates, maybe today
                    dateFormat="MMMM d, yyyy"
                />
            </div>

             {error && <p style={{ color: 'red' }}>{error}</p>}
             {loading && <LoadingSpinner message="Loading data..." />}

             {!loading && (
                 <div className="daily-slots-manage">
                     <h3>Slots for {format(selectedDate, 'MMMM d, yyyy')}</h3>
                     {dailySlots.length === 0 && <p>No time slots generated for this day (check working hours).</p>}
                     {dailySlots.map(slot => (
                         <div key={slot.iso} className={`manage-slot ${slot.isPast ? 'past' : ''} ${slot.isBooked ? 'booked' : ''} ${slot.isBlocked ? 'blocked' : 'available'}`}>
                             <span>{slot.timeLabel}</span>
                             <span className="slot-status">
                                {slot.isPast ? '(Past)' :
                                 slot.isBooked ? '(Booked)' :
                                 slot.isBlocked ? '(Blocked by You)' :
                                 '(Available)'}
                             </span>
                             {!slot.isPast && !slot.isBooked && (
                                 <button
                                     onClick={() => handleSlotAction(slot.iso, slot.isBlocked ? 'unblock' : 'block')}
                                     disabled={actionLoading}
                                     className={slot.isBlocked ? 'unblock-button' : 'block-button'}
                                 >
                                     {actionLoading ? '...' : (slot.isBlocked ? 'Unblock' : 'Block')}
                                 </button>
                             )}
                         </div>
                     ))}
                 </div>
             )}
        </div>
    );
}

export default ManageAvailabilityPage;