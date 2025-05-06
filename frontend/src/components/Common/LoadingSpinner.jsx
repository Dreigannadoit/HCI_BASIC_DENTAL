import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div className="spinner-overlay">
            <div className="spinner"></div>
            <p>{message}</p>
        </div>
    );
};

export default LoadingSpinner;

