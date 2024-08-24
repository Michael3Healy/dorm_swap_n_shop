const parseAddress = address => {
	const parts = address.split(',').map(part => part.trim());

	if (parts.length === 4) {
		const [street, city, state, zip] = parts;
		return { street, city, state, zip };
	} else {
		throw new Error('Address format is incorrect');
	}
};

export { parseAddress };
