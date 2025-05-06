import React, { createContext, useState, useEffect, useMemo } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This effect primarily handles the initial load
        const token = localStorage.getItem('authToken');
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (token && storedUser) {
            setAuthToken(token);
            setUser(storedUser);
        } else {
            // Ensure state is cleared if localStorage is missing items
            setAuthToken(null);
            setUser(null);
        }
        setIsLoading(false);
    }, []); // Run only once on mount

    const login = (token, userData) => { // userData = { username, role }
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuthToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setAuthToken(null);
        setUser(null);
        // Navigation should happen in the component calling logout (e.g., Navbar)
    };

    // Memoize the context value to prevent unnecessary re-renders
    const authContextValue = useMemo(() => ({
        authToken,
        user,
        // Derive role without 'ROLE_' prefix for easier use in components
        userRole: user?.role?.startsWith('ROLE_') ? user.role.substring(5) : user?.role,
        isLoggedIn: !!authToken && !!user,
        isLoading,
        login,
        logout,
    }), [authToken, user, isLoading]); // Dependencies for useMemo

    // Render loading state or children
    return (
        <AuthContext.Provider value={authContextValue}>
            {isLoading ? <div>Loading session...</div> : children}
        </AuthContext.Provider>
    );
};