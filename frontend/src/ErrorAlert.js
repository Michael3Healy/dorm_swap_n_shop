// ErrorAlert.js
import React from 'react';
import './ErrorAlert.css';

// Component for displaying an error message.
const ErrorAlert = ({error}) => {
    return (
        <div className="ErrorAlert">
            <h2>Error</h2>
            <p>{ error }</p>
        </div>
    );
};

export default ErrorAlert;
