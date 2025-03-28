/**
 *
 * @param {string|Function} type
 * @param {object} props
 * @param  {...any} children
 * @returns
 */
export const createElement = (type, props, ...children) => {
	type = validate(type);

	return {
		type,
		props: {
			...props,
			children: children.flat(),
		},
	};
};

/**
 *
 * @param {*} type
 * @returns {string|object}
 */
const validate = (type) => {
	if (typeof type !== "function" && typeof type !== "string") {
		throw Error("Type must be filled with function or string");
	}

	return type;
};
