import axios from 'axios';

const API_BASE_URL = 'http://localhost:9080/api'; // Your Spring Boot API URL

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Interceptor to handle 401/403 globally (e.g., logout, redirect)
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Example: Clear token and redirect to login
            // This logic might be better handled within AuthContext or specific components
            // to avoid immediate redirects during background token refresh attempts etc.
            console.error("Auth Error:", error.response.data.message || "Unauthorized/Forbidden");
            // localStorage.removeItem('authToken');
            // localStorage.removeItem('userRole');
            // window.location.href = '/login'; // Hard redirect, consider using navigate from router context
        }
        return Promise.reject(error);
    }
);

export default api;