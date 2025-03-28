let rerender = () => {};
let stateIndex = 0;
let states = [];
/**
 *
 * @param {any} initialState
 * @returns
 */
export const createState = (initialValue) => {
	const currentIndex = stateIndex;

	// Gunakan nilai state yang sudah ada, jika tidak, gunakan nilai awal
	states[currentIndex] = states[currentIndex] ?? initialValue;

	const setState = (newValue) => {
		states[currentIndex] =
			typeof newValue === "function"
				? newValue(states[currentIndex])
				: newValue;

		rerender(); // Trigger re-render setelah state berubah
	};

	stateIndex++; // Naikkan index untuk state berikutnya

	return [states[currentIndex], setState];
};

/**
 *
 * @param {Function} callback
 */
export const setRenderCallback = (callback) => {
	rerender = callback;
};

export const resetStateIndex = () => {
	stateIndex = 0;
};
