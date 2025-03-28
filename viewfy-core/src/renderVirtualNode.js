import { setRenderRouterCallback } from "./routers";
import {
	parseStyleGlobalTohead,
	parseStyleTohead,
	ressetStyles,
} from "./createStyle";
import { cleanupEffects, runEffects } from "./createEffect";
import { resetStateIndex, setRenderCallback } from "./createState";

/**
 *
 * @param {object} component
 * @param {HTMLElement} container
 */
export const render = (component, container) => {
	const reRender = () => {
		cleanupEffects();
		resetStateIndex();
		const newComponent = component;
		if (!container) container = document.getElementById("root");

		container.innerHTML = "";
		ressetStyles();
		container.appendChild(renderVirtualNode(newComponent));
		parseStyleGlobalTohead();

		runEffects();
	};

	// subscribe(reRender);
	setRenderRouterCallback(reRender);
	setRenderCallback(reRender);
	reRender();
};

/**
 *
 * @param {object|Function|Text} vnode
 * @returns {HTMLElement|Text}
 */
export const renderVirtualNode = (vnode) => {
	if (!vnode) return document.createTextNode("");

	// Jika vnode adalah string atau number, buat Text Node
	if (typeof vnode === "string" || typeof vnode === "number") {
		return document.createTextNode(vnode);
	}

	// Jika vnode adalah function (Functional Component), render ulang
	if (typeof vnode.type === "function") {
		return renderVirtualNode(vnode.type({ ...vnode.props }));
	}

	// Jika vnode adalah Fragment
	if (vnode.type === "fragment") {
		const fragment = document.createDocumentFragment();
		vnode.props.children.forEach((child, ix) => {
			fragment.appendChild(renderVirtualNode(child));
		});

		return fragment;
	}

	// Jika vnode adalah elemen HTML
	const element = document.createElement(vnode.type);

	if (vnode.props) {
		for (const [key, value] of Object.entries(vnode.props)) {
			if (key !== "children") {
				if (key.startsWith("on")) {
					handleStartWithOn(key, value, element);
				} else if (key === "className") {
					element.setAttribute("class", value);
				} else if (key === "style") {
					let style = value;
					parseStyleTohead(element, style);
				} else {
					element.setAttribute(key, value);
				}
			}
		}

		const children = vnode.props.children || [];
		children.forEach((child) => {
			element.appendChild(renderVirtualNode(child));
		});

		return element;
	}
};

/**
 *
 * @param {*} key
 * @param {*} value
 * @param {*} element
 */
export const handleStartWithOn = (key, value, element) => {
	// handle on click
	if (key.endsWith("Click")) {
		element.addEventListener("click", value);
	}
};
