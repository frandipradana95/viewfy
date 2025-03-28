const cache = new WeakMap();
const classesForStyle = {};
const processedStyles = {};
const processedStylesname = {};
const processedStyleGlobals = {};
let stylesTag;
let styleid;
let stylesTagGlobals;

/**
 * Konversi object style menjadi string CSS
 * @param {Object} styles - Object berisi style
 * @returns {string} - CSS String
 */
const convertToCSS = (styles) => {
	return Object.entries(styles)
		.map(([key, value]) => {
			if (key === "content") {
				value = `"${value}"`;
			}
			const cssKey = key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()); // camelCase to kebab-case
			return `${cssKey}: ${typeof value === "number" ? value + "px" : value};`;
		})
		.join(" ");
};

/**
 * Buat style seperti React Native StyleSheet
 * @param {Object} styles - Object berisi style
 * @returns {Object} - Object style yang sudah dikonversi ke inline-style
 */
export const createStyle = (styles) => {
	stylesTag = document.createElement("style");

	if (!styleid) {
		document.head.appendChild(stylesTag);
		stylesTag.setAttribute("id", "viewfy-styles");
	}
	styleid = document.getElementById("viewfy-styles");

	if (cache.has(styles)) return cache.get(styles);

	for (const key in styles) {
		classesForStyle[key] = makeString(8);
		// processedStyles[key] = convertToCSS(styles[key]);
		processedStyles[key] = { default: "", pseudo: {} };
		processedStylesname[key] = key;
		for (const prop in styles[key]) {
			if (prop.startsWith(":") || prop.startsWith("::")) {
				// Handle pseudo-class
				processedStyles[key].pseudo[prop] = convertToCSS(styles[key][prop]);
			} else {
				processedStyles[key].default +=
					convertToCSS({ [prop]: styles[key][prop] }) + " ";
			}
		}
	}

	cache.set(styles, processedStyles);

	return processedStylesname;
};

/**
 * Recomended key in object typeof string
 * @param {object} styles
 *
 */
export const createStyleGlobals = (styles) => {
	stylesTagGlobals = document.createElement("style");
	document.head.appendChild(stylesTagGlobals);

	for (const key in styles) {
		processedStyleGlobals[key] = { default: "", pseudo: {} };
		// processedStyleGlobals[key] = convertToCSS(styles[key]);
		for (const prop in styles[key]) {
			if (prop.startsWith(":") || prop.startsWith("::")) {
				// Handle pseudo-class
				processedStyleGlobals[key].pseudo[prop] = convertToCSS(
					styles[key][prop]
				);
			} else {
				processedStyleGlobals[key].default +=
					convertToCSS({ [prop]: styles[key][prop] }) + " ";
			}
		}
	}
};

export const parseStyleGlobalTohead = () => {
	if (stylesTagGlobals) {
		for (const key in processedStyleGlobals) {
			if (processedStyleGlobals[key].default.trim().length > 0) {
				stylesTagGlobals.appendChild(
					document.createTextNode(
						`${key} {${processedStyleGlobals[key].default.trim()}}`
					)
				);
			}

			if (Object.keys(processedStyleGlobals[key].pseudo).length > 0) {
				for (const pseudo in processedStyleGlobals[key].pseudo) {
					stylesTagGlobals.appendChild(
						document.createTextNode(
							` ${key}${pseudo} { ${processedStyleGlobals[key].pseudo[pseudo]} }`
						)
					);
				}
			}
		}
	}
};

export const parseStyleTohead = (element, style) => {
	styleid.appendChild(document.createTextNode(""));

	for (const key in classesForStyle) {
		if (style === key) {
			if (styleid) {
				// Pastikan ada style sebelum menambahkannya ke <style> tag
				if (processedStyles[key].default.trim().length > 0) {
					styleid.appendChild(
						document.createTextNode(
							` .${classesForStyle[key]} { ${processedStyles[
								key
							].default.trim()} }`
						)
					);
				}

				// Pastikan ada pseudo-class sebelum menambahkannya ke <style> tag
				if (Object.keys(processedStyles[key].pseudo).length > 0) {
					for (const pseudo in processedStyles[key].pseudo) {
						styleid.appendChild(
							document.createTextNode(
								` .${classesForStyle[key]}${pseudo} { ${processedStyles[key].pseudo[pseudo]} }`
							)
						);
					}
				}
				// styleid.appendChild(
				// 	document.createTextNode(
				// 		` .${classesForStyle[key]} { ${processedStyles[key]}}`
				// 	)
				// );
			}
			element.classList.add(classesForStyle[style]);
		}
	}
};

export const ressetStyles = () => {
	if (styleid) {
		styleid.innerHTML = "";
	}

	if (stylesTagGlobals) {
		stylesTagGlobals.innerHTML = "";
	}
};

const makeString = (length) => {
	let result = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
};
