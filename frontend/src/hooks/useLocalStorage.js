import { useState } from 'react';

// Custom hook to handle local storage
const useLocalStorage = (key, initialValue) => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (err) {
			console.error(err);
			return initialValue;
		}
	});
	const setValue = value => {
		try {
			setStoredValue(value);
			localStorage.setItem(key, JSON.stringify(value));
		} catch (err) {
			// console.error(err);
		}
	};
	return [storedValue, setValue];
};

export default useLocalStorage;
