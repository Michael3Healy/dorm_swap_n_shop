// ErrorAlert.js
import React from 'react';
import './ErrorAlert.css';

// Component for displaying an error message.
const ErrorAlert = ({ error }) => {
	// If error is an object and has multiple keys, display each error message
	let errorMessages;

	if (typeof error === 'object') {
		// Extract error messages from an object
		errorMessages = error.message || Object.values(error).map((message, idx) => <p key={idx}>{message}</p>);
	} else if (Array.isArray(error)) {
		// Extract error messages from an array
		errorMessages = error.map((message, idx) => <p key={idx}>{message}</p>);
	} else if (typeof error === 'string') {
		// Display the error message as is
		errorMessages = error;
	}

	return (
		<div className='ErrorAlert'>
			<h2>Error</h2>
			<div>{errorMessages}</div>
		</div>
	);
};

export default ErrorAlert;
