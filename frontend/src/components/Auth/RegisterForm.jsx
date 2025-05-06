import React, { useState } from 'react';

function RegisterForm({ onSubmit, loading, userType }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password || !name) {
            alert("Please fill in all fields.");
            return;
        }
        // Add more validation (e.g., password strength) if desired
        onSubmit({ username, password, name });
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
             <div className="form-group">
                <label htmlFor="name">Full Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="reg-username">Username (Email recommended):</label>
                <input
                    type="text" // or "email"
                    id="reg-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label htmlFor="reg-password">Password:</label>
                <input
                    type="password"
                    id="reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6" // Match backend validation if any
                    disabled={loading}
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : `Register as ${userType}`}
            </button>
        </form>
    );
}

export default RegisterForm;