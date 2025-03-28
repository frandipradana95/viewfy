let globalState = {};
let listeners = [];

/**
 * Buat store global
 * @param {Object} initialState - State awal
 */
export const createStore = (initialState = {}) => {
	globalState = initialState;
	return {
		getState,
		setState,
		subscribe,
		unsubscribe,
	};
};

/**
 * Dapatkan state saat ini
 */
export const getState = (key = "") => {
	if (key !== "") {
		return globalState[key];
	}
	return globalState;
};

/**
 * Update state dan beri tahu semua listener
 * @param {Object|Function} newState - State baru atau updater function
 */
export const setState = (newState) => {
	if (typeof newState === "function") {
		globalState = { ...globalState, ...newState(globalState) };
	} else {
		globalState = { ...globalState, ...newState };
	}
	listeners.forEach((listener) => listener(globalState));
};

/**
 * Tambahkan listener untuk mendengar perubahan state
 * @param {Function} callback
 */
export const subscribe = (callback) => {
	listeners.push(callback);
	return () => unsubscribe(callback);
};

/**
 * Hapus listener agar tidak mendengar perubahan state
 * @param {Function} callback
 */
export const unsubscribe = (callback) => {
	listeners = listeners.filter((listener) => listener !== callback);
};
