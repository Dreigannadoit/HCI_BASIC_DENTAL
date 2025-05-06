import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, setHours, setMinutes, setSeconds } from 'date-fns';
import { blockTimeSlot, unblockTimeSlot } from '../../services/dentistService';

// This component is more complex in practice as it needs to display
// existing schedule/blocks and provide block/unblock actions per slot.
// This is a simplified version focusing only on the action.
function BlockSlotForm({ selectedDate, onSlotUpdate }) {
    const [selectedTime, setSelectedTime] = useState(null); // Could be a specific time string like '10:00:00'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Example time slots (adjust based on your backend's granularity)
    const timeOptions = [];
    for (let hour = 9; hour < 17; hour++) { // Assuming 9 AM to 5 PM working hours
        timeOptions.push(`${String(hour).padStart(2, '0')}:00:00`);
    }

    const handleAction = async (actionType) => {
        if (!selectedDate || !selectedTime) {
            setError('Please select a date and time slot.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Construct the full ISO dateTime string
            const datePart = format(selectedDate, 'yyyy-MM-dd');
            const isoDateTimeString = `${datePart}T${selectedTime}`;

            if (actionType === 'block') {
                await blockTimeSlot(isoDateTimeString);
                alert(`Slot ${selectedTime} on ${datePart} blocked successfully.`);
            } else if (actionType === 'unblock') {
                await unblockTimeSlot(isoDateTimeString);
                 alert(`Slot ${selectedTime} on ${datePart} unblocked successfully.`);
            }
            if (onSlotUpdate) {
                onSlotUpdate(); // Notify parent to refresh availability display
            }
        } catch (err) {
             setError(err.response?.data?.message || `Failed to ${actionType} slot.`);
             console.error(err);
        } finally {
            setLoading(false);
            setSelectedTime(null); // Reset time selection
        }
    };

    return (
        <div className="block-slot-form">
            <h4>Manage Slot Availability</h4>
             {error && <p style={{ color: 'red' }}>{error}</p>}
             <p>Select time for {format(selectedDate, 'MMMM d, yyyy')}:</p>
             <select value={selectedTime || ''} onChange={(e) => setSelectedTime(e.target.value)}>
                 <option value="">-- Select Time --</option>
                 {timeOptions.map(time => <option key={time} value={time}>{format(parseISO(`2000-01-01T${time}`), 'p')}</option>)}
             </select>

             {selectedTime && (
                 <div style={{marginTop: '10px'}}>
                    <button onClick={() => handleAction('block')} disabled={loading}>
                        {loading ? 'Blocking...' : 'Block Selected Slot'}
                    </button>
                     <button onClick={() => handleAction('unblock')} disabled={loading} style={{marginLeft: '10px'}}>
                        {loading ? 'Unblocking...' : 'Unblock Selected Slot'}
                    </button>
                 </div>
             )}
        </div>
    );
}

export default BlockSlotForm;