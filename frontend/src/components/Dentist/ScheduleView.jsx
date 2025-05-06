import React from 'react';
import AppointmentDetailCard from './AppointmentDetailCard';
import { format, parseISO } from 'date-fns';

function ScheduleView({ schedule, onDeleteAppointment }) {
    if (!schedule || schedule.length === 0) {
        return <p>No appointments found for the selected date range.</p>;
    }

     // Group appointments by date
    const groupedSchedule = schedule.reduce((acc, app) => {
        const dateStr = format(parseISO(app.appointmentDateTime), 'yyyy-MM-dd');
        if (!acc[dateStr]) {
        acc[dateStr] = [];
        }
        acc[dateStr].push(app);
        return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedSchedule).sort();


    return (
        <div className="schedule-view">
             {sortedDates.map(dateStr => (
                <div key={dateStr} className="schedule-day">
                    <h3>{format(parseISO(dateStr), 'EEEE, MMMM d, yyyy')}</h3>
                    {groupedSchedule[dateStr]
                        .sort((a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime)) // Sort by time within day
                        .map((app) => (
                            <AppointmentDetailCard
                                key={app.id}
                                appointment={app}
                                onDelete={onDeleteAppointment}
                            />
                        ))}
                </div>
            ))}
        </div>
    );
}

export default ScheduleView;
// TODO: Add CSS for .schedule-view, .schedule-day