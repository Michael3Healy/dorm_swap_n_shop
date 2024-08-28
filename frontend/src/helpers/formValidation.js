const validate = (values, fieldNames) => {
	try {
		const errors = {};

		if (fieldNames.includes('email') && !/\S+@\S+\.\S+/.test(values.email)) {
			errors.email = 'Email is invalid';
		}
		if (fieldNames.includes('password') && values.password.length < 6) {
			errors.password = 'Password must be 6 or more characters';
		}
		if (fieldNames.includes('phoneNumber') && !validatePhoneNumber(values.phoneNumber)) {
			errors.phoneNumber = 'Phone number must be a valid phone number';
		}
		if (fieldNames.includes('firstName') && !/^[A-Za-z]+$/.test(values.firstName)) {
			errors.firstName = 'First name must contain only letters';
		}
		if (fieldNames.includes('lastName') && !/^[A-Za-z]+$/.test(values.lastName)) {
			errors.lastName = 'Last name must contain only letters';
		}
		if (fieldNames.includes('url') && !validateUrl(values.url)) {
			errors.url = 'URL is invalid';
		}
		// Street address validation
		if (fieldNames.includes('street')) {
			const streetError = validateStreetAddress(values.street.trim());
			if (streetError) {
				errors.street = streetError;
			}
		}
		// Validate city name
		if (fieldNames.includes('city') && !/^[A-Za-z\s\-']{2,}$/.test(values.city.trim())) {
			errors.city = 'City name is invalid';
		}
		// State validation
		if (fieldNames.includes('state') && !/^[A-Za-z]{2}$/.test(values.state)) {
			errors.state = 'State must be a valid two-letter abbreviation';
		}
		// ZIP code validation
		if (fieldNames.includes('zipCode') && !/^\d{5}(-\d{4})?$/.test(values.zipCode)) {
			errors.zipCode = 'ZIP code is invalid';
		}
		return errors;
	} catch (error) {
		error.message = error.message || 'An error occurred while validating the form';
		throw error;
	}
};

const validateUrl = url => {
	const urlPattern = new RegExp(
		'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i' // fragment locator
	);

	return !!urlPattern.test(url);
};

const validatePhoneNumber = phoneNumber => {
	// Check for optional delimiters like -, ., and spaces
	const phonePattern = /^(\+?\d{1,4})?[\s.-]?(\(?\d{1,4}\)?)?[\s.-]?(\d{1,4})[\s.-]?(\d{1,9})$/;

	// Check if the phone number matches the pattern and has at least 10 characters
	return phoneNumber.length >= 10 && phonePattern.test(phoneNumber);
};

// Validate general format and required characters
const validateStreetAddress = address => {
	const allowedCharacters = /^[\dA-Za-z\s.,-]+$/; // General format check
	const hasNumber = /\d/; // Check for at least one number
	const hasLetter = /[A-Za-z]/; // Check for at least one letter
	const hasSpace = /\s/; // Check for at least one space

	if (!allowedCharacters.test(address)) {
		return 'Street address contains invalid characters';
	}
	if (!hasNumber.test(address)) {
		return 'Street must include address number';
	}
	if (!hasLetter.test(address)) {
		return 'Street address must include at least one letter';
	}
	if (!hasSpace.test(address)) {
		return 'Street address must include at least one space';
	}

	return null; // No errors
};

export { validate };
