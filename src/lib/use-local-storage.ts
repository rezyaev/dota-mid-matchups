import { useState } from "react";

export function useLocalStorage(key: string, defaultValue: string): [string, (newValue: string) => void] {
	const [value, setValue] = useState(() => {
		const storageValue = localStorage.getItem(key);
		return storageValue ?? defaultValue;
	});

	function setLocalStorageValue(newValue: string) {
		setValue(newValue);
		localStorage.setItem(key, newValue);
	}

	return [value, setLocalStorageValue];
}
