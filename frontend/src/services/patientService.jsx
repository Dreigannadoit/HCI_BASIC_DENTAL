import api from './api';
import { format } from 'date-fns';

// Fetch all users with the DENTIST role
export const getAvailableDentists = async () => {
    const response = await api.get('/patient/dentists');
    return response.data; // Expected: Array of UserDto { id, username, name, role }
};

// Fetch available time slots for a specific dentist on a specific date
export const getDentistAvailability = async (dentistId, date) => {
    // Format date to YYYY-MM-DD string
    const dateString = format(date, 'yyyy-MM-dd');
    const response = await api.get(`/patient/dentists/${dentistId}/availability?date=${dateString}`);
    return response.data; // Expected: Array of AvailabilitySlotDto { dateTime: "ISOString", available: boolean }
};

// Book a new appointment
export const bookNewAppointment = async (appointmentData) => {
    // appointmentData: { dentistId: number, appointmentDateTime: "ISOString" }
    const response = await api.post('/patient/appointments', appointmentData);
    return response.data; // Expected: AppointmentDto
};

// Get upcoming appointments for the logged-in patient
export const getPatientUpcomingAppointments = async () => {
    const response = await api.get('/patient/appointments/upcoming');
    return response.data; // Expected: Array of AppointmentDto
};

// Get a specific appointment detail (if backend endpoint exists)
// Note: This might not be necessary if upcoming appointments list has all needed info
export const getAppointmentByIdForPatient = async (appointmentId) => {
    try {
      // Assuming a backend endpoint like this exists. Adjust if needed.
      const response = await api.get(`/patient/appointments/${appointmentId}`);
      return response.data; // Expected: AppointmentDto
    } catch (error) {
       console.error(`Error fetching appointment ${appointmentId}:`, error);
       throw error; // Re-throw to be handled by the component
    }
};


// Update an existing appointment
export const updatePatientAppointment = async (appointmentId, appointmentData) => {
    // appointmentData: { dentistId: number, appointmentDateTime: "ISOString" }
    const response = await api.put(`/patient/appointments/${appointmentId}`, appointmentData);
    return response.data; // Backend might return updated AppointmentDto or just success message
};

// Cancel an appointment
export const cancelPatientAppointment = async (appointmentId) => {
    const response = await api.delete(`/patient/appointments/${appointmentId}`);
    return response.data; // Expects success message like "Appointment cancelled successfully."
};