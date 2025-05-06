import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/authService';
import LoginForm from '../components/Auth/LoginForm'; // You'll create this

function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (credentials) => {
        setLoading(true);
        setError('');
        try {
            const data = await loginUser(credentials); // data = { token, username, role }
            auth.login(data.token, { username: data.username, role: data.role });

            // Navigate based on role after login
            if (data.role === 'ROLE_PATIENT') {
                navigate(from === "/" ? "/patient/dashboard" : from, { replace: true });
            } else if (data.role === 'ROLE_DENTIST') {
                navigate(from === "/" ? "/dentist/dashboard" : from, { replace: true });
            } else {
                navigate(from, { replace: true }); // Fallback
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <LoginForm onSubmit={handleLogin} loading={loading} />
            {/* Add link to RegisterPage */}
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
}

export default LoginPage;