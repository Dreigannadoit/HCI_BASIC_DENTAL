import React from 'react';
import { format, parseISO } from 'date-fns';
import LoadingSpinner from '../Common/LoadingSpinner';

function DentistAvailability({ slots, selectedSlot, onSelectSlot, loading, selectedDate }) {
    if (loading) {
        return <LoadingSpinner message="Fetching availability..." />;
    }

    if (!slots || slots.length === 0) {
        return <p>No availability data for this day.</p>;
    }

    const availableSlots = slots.filter(slot => slot.available);

    if (availableSlots.length === 0) {
        return <p>No available slots for {format(selectedDate, 'MMMM d, yyyy')}.</p>;
    }

    return (
        <div className="availability-container">
            <h4>Available Slots for {format(selectedDate, 'MMMM d, yyyy')}</h4>
            <div className="time-slots">
                {availableSlots.map((slot) => (
                    <button
                        key={slot.dateTime}
                        onClick={() => onSelectSlot(slot.dateTime)}
                        className={`time-slot-button ${selectedSlot === slot.dateTime ? 'selected' : ''}`}
                    >
                        {format(parseISO(slot.dateTime), 'p')} {/* Format like "10:00 AM" */}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DentistAvailability;
