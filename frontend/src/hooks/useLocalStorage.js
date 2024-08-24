import { useState } from 'react';

// Custom hook to handle local storage
const useLocalStorage = (key, initialValue) => {
	try {
		const [storedValue, setStoredValue] = useState(() => {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		});
		const setValue = value => {
			setStoredValue(value);
			localStorage.setItem(key, JSON.stringify(value));
		};
		return [storedValue, setValue];
	} catch (err) {
		console.error(err);
	}
};

export default useLocalStorage;
