export const persistData = <T extends string>(key: string, data: T) => {
	window.localStorage.setItem(key, data);
};

export const getPersistedData = (key: string): string | null => {
	return window.localStorage.getItem(key);
};
