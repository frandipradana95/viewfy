let effects = [];
let cleanupFunctions = [];
let currentEffectIndex = 0;

export const createEffect = (callback, dependencies) => {
	const effectIndex = currentEffectIndex;
	const prevDeps = effects[effectIndex]?.deps;

	const hasChanged =
		!prevDeps || dependencies.some((dep, i) => dep !== prevDeps[i]);

	if (hasChanged) {
		// Jalankan cleanup sebelumnya jika ada
		cleanupFunctions[effectIndex]?.();
		// Simpan cleanup baru jika ada
	}
	cleanupFunctions[effectIndex] = callback() || null;

	effects[effectIndex] = { deps: dependencies };
	currentEffectIndex++;
};

export function runEffects() {
	// Reset index agar efek dijalankan ulang
	currentEffectIndex = 0;
}

export function cleanupEffects() {
	cleanupFunctions.forEach((cleanup) => cleanup && cleanup());
}
