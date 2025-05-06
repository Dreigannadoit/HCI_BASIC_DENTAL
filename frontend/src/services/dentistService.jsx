import api from './api';
import { format } from 'date-fns';

// Get the dentist's schedule for a date range
export const getDentistSchedule = async (startDate, endDate) => {
    const startDateString = format(startDate, 'yyyy-MM-dd');
    const endDateString = format(endDate, 'yyyy-MM-dd');
    const response = await api.get(`/dentist/schedule?startDate=${startDateString}&endDate=${endDateString}`);
    return response.data; // Expected: Array of AppointmentDto
};

// Block a specific time slot
export const blockTimeSlot = async (dateTime) => {
    // dateTime should be ISO string "YYYY-MM-DDTHH:mm:ss"
    const response = await api.post('/dentist/block-slot', { dateTime });
    return response.data; // Expects success message
};

// Unblock a specific time slot
export const unblockTimeSlot = async (dateTime) => {
    // dateTime should be ISO string
    // Axios DELETE with data requires the 'data' key
    const response = await api.delete('/dentist/unblock-slot', { data: { dateTime } });
    return response.data; // Expects success message
};

// Delete/cancel an appointment from the dentist's schedule
export const deleteDentistAppointment = async (appointmentId) => {
    const response = await api.delete(`/dentist/appointments/${appointmentId}`);
    return response.data; // Expects success message
};

// Optional: Get blocked slots for a specific date (useful for ManageAvailabilityPage)
export const getBlockedSlots = async (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    // NOTE: Backend needs an endpoint for this, e.g., /dentist/blocked-slots?date=YYYY-MM-DD
    // Example assumes endpoint exists:
    // const response = await api.get(`/dentist/blocked-slots?date=${dateString}`);
    // return response.data; // Expected: Array of BlockedSlot objects or just their dateTimes
    console.warn("getBlockedSlots service function needs a corresponding backend endpoint.");
    return []; // Placeholder
}