import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerPatient, registerDentist } from '../services/authService';
import RegisterForm from '../components/Auth/RegisterForm'; // You'll create this

function RegisterPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState('PATIENT'); // PATIENT or DENTIST
    const navigate = useNavigate();

    const handleRegister = async (userData) => { // userData = { username, password, name }
        setLoading(true);
        setError('');
        try {
            if (userType === 'PATIENT') {
                await registerPatient(userData);
            } else {
                await registerDentist(userData); // Add extra validation for dentist registration if needed
            }
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.messages?.username || 'Registration failed.');
            console.error("Registration error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <div>
                <label>
                    <input
                        type="radio"
                        value="PATIENT"
                        checked={userType === 'PATIENT'}
                        onChange={() => setUserType('PATIENT')}
                    />
                    I am a Patient
                </label>
                <label style={{ marginLeft: '20px' }}>
                    <input
                        type="radio"
                        value="DENTIST"
                        checked={userType === 'DENTIST'}
                        onChange={() => setUserType('DENTIST')}
                    />
                    I am a Dentist/Staff
                </label>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <RegisterForm onSubmit={handleRegister} loading={loading} userType={userType} />
             <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
}

export default RegisterPage;