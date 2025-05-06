import api from './api';

export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // Expected: { token, username, role }
};

export const registerPatient = async (userData) => {
    // userData: { username, password, name }
    const response = await api.post('/auth/register/patient', userData);
    return response.data;
};

export const registerDentist = async (userData) => {
    // userData: { username, password, name }
    const response = await api.post('/auth/register/dentist', userData);
    return response.data;
};