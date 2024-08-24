const validate = values => {
	const errors = {};

	if (!/\S+@\S+\.\S+/.test(values.email)) {
		errors.email = 'Email is invalid';
	}
	if (values.password.length < 6) {
		errors.password = 'Password must be 6 or more characters';
	}
	if (!validatePhoneNumber(values.phoneNumber)) {
		errors.phoneNumber = 'Phone number must be a valid phone number';
	}
	if (!/^[A-Za-z]+$/.test(values.firstName)) {
		errors.firstName = 'First name must contain only letters';
	}
	if (!/^[A-Za-z]+$/.test(values.lastName)) {
		errors.lastName = 'Last name must contain only letters';
	}
	return errors;
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
	// This pattern matches phone numbers with optional delimiters like -, ., and spaces
	const phonePattern = /^(\+?\d{1,4})?[\s.-]?(\(?\d{1,4}\)?)?[\s.-]?(\d{1,4})[\s.-]?(\d{1,9})$/;
	return !!phonePattern.test(phoneNumber);
};

module.exports = { validate };
