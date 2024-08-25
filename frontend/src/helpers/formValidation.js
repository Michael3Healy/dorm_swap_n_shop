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
		if (fieldNames.includes('address') && !validateAddress(values.address)) {
			errors.address = 'Address is invalid';
		}
		return errors;
	} catch (error) {
		error.message = error.message || 'An error occurred while validating the form';
		console.log('intiial error', error);
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

const validateAddress = address => {
	const addressPattern = /^\d+\s[\w\s]+,\s[\w\s]+,\s([A-Z]{2}|[A-Za-z\s]+),\s\d{5}(-\d{4})?$/i;
	return !!addressPattern.test(address);
};

const validatePhoneNumber = phoneNumber => {
	// This pattern matches phone numbers with optional delimiters like -, ., and spaces
	const phonePattern = /^(\+?\d{1,4})?[\s.-]?(\(?\d{1,4}\)?)?[\s.-]?(\d{1,4})[\s.-]?(\d{1,9})$/;
	return !!phonePattern.test(phoneNumber);
};

export { validate };
