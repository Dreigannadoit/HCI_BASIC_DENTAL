import { format, parseISO, isBefore, startOfDay } from 'date-fns';

export const formatAppointmentDate = (isoDateTimeString) => {
    if (!isoDateTimeString) return 'N/A';
    try {
        const date = parseISO(isoDateTimeString);
        return format(date, 'MMMM d, yyyy'); // e.g., "May 6, 2025"
    } catch (e) {
        console.error("Error parsing date:", isoDateTimeString, e);
        return "Invalid Date";
    }
};

export const formatAppointmentTime = (isoDateTimeString) => {
     if (!isoDateTimeString) return 'N/A';
     try {
        const date = parseISO(isoDateTimeString);
        return format(date, 'p'); // e.g., "10:00 AM"
    } catch (e) {
        console.error("Error parsing time:", isoDateTimeString, e);
        return "Invalid Time";
    }
};

export const formatReadableDateTime = (isoDateTimeString) => {
     if (!isoDateTimeString) return 'N/A';
     try {
        const date = parseISO(isoDateTimeString);
        return format(date, 'MMM d, yyyy @ p'); // e.g., "May 6, 2025 @ 10:00 AM"
    } catch (e) {
        console.error("Error parsing datetime:", isoDateTimeString, e);
        return "Invalid DateTime";
    }
};

export const formatIsoDate = (dateObject) => {
    if (!dateObject) return null;
    return format(dateObject, 'yyyy-MM-dd'); // For API calls
};

export const formatIsoDateTime = (dateObject, timeString /* HH:mm:ss */) => {
    if (!dateObject || !timeString) return null;
    const datePart = format(dateObject, 'yyyy-MM-dd');
    return `${datePart}T${timeString}`;
};

// Check if an ISO date/time string represents a time in the past
export const isPastAppointment = (isoDateTimeString) => {
    if (!isoDateTimeString) return true; // Treat invalid/missing as past
    try {
        const appointmentDate = parseISO(isoDateTimeString);
        // Compare with the *start* of today to include appointments happening later today
        return isBefore(appointmentDate, new Date());
    } catch (e) {
        console.error("Error checking if past:", isoDateTimeString, e);
        return true; // Treat errors as past
    }
};

// Check if an ISO date/time string is today or in the future
export const isFutureOrTodayAppointment = (isoDateTimeString) => {
    if (!isoDateTimeString) return false;
    try {
        const appointmentDate = parseISO(isoDateTimeString);
        const todayStart = startOfDay(new Date());
        return !isBefore(appointmentDate, todayStart);
    } catch (e) {
        console.error("Error checking if future:", isoDateTimeString, e);
        return false;
    }
}