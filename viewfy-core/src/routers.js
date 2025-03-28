import { createEffect } from "./createEffect";
import { createElement } from "./createElement";
import { resetStateIndex } from "./createState";
import { createStore } from "./createStore";

let parameters = {};
const routerStore = createStore({
	currentPath: window.location.pathname,
});
let renderer = () => {};
let routesConfigs = {
	reload: false,
};

export const Router = ({ children }) => {
	// const [currentPath, setCurrentPath] = createState(window.location.pathname);
	const { currentPath } = routerStore.getState();

	routerStore.subscribe((prev) => {
		renderer();
		return prev;
	});

	const updateParams = (newPath) => {
		let newParams = {};
		children.forEach((routes) => {
			routes.props.children.forEach((route) => {
				if (route.props.path) {
					const match = matchPath(route.props.path, newPath);
					if (match) {
						newParams = match.params;
					}
				}
			});
		});
		// Hanya update jika params berubah
		if (JSON.stringify(parameters) !== JSON.stringify(newParams)) {
			parameters = newParams;
		}
	};

	// Update state saat URL berubah
	const routeChange = () => {
		const newPath = window.location.pathname;
		if (currentPath !== newPath) {
			resetStateIndex();
			routerStore.setState({ currentPath: newPath });
			updateParams(newPath);
		}

		parameters = {};
	};

	createEffect(() => {
		window.addEventListener("popstate", routeChange);
		return () => {
			return window.removeEventListener("popstate", routeChange);
		};
	}, [routeChange]);

	return createElement(Switch, { currentPath }, ...children);
};

export const Switch = ({ children, currentPath }) => {
	let activeRoute = null;
	let props = {};
	children.forEach((routes) => {
		routes.props.children.forEach((route) => {
			if (route.props.path) {
				const match = matchPath(route.props.path, currentPath);
				if (match) {
					parameters = match.params;
					activeRoute = route.props.component;
					let componentProps = route.props.component.props;
					props = { ...props, ...componentProps };
				}
			}
		});
	});

	if (activeRoute !== null) {
		if (typeof activeRoute === "function") {
			return createElement(activeRoute, { ...props });
		} else {
			return createElement((p) => activeRoute(...p), { ...props });
		}
	}
	return createElement("span", { style: "color:red" }, "404 Not Found");
};

export const Route = ({ path, component }) => {
	return createElement("fragment", {}, component);
};

export const Link = ({ path, children }) => {
	return createElement(
		"a",
		{
			href: path,
			onClick: (e) => {
				if (!routesConfigs.reload) {
					e.preventDefault();
					window.history.pushState({}, "", path);
					window.dispatchEvent(new Event("popstate"));
				}
			},
		},
		children
	);
};

export const getParameters = (name) => {
	return parameters[name];
};

const matchPath = (routePath, currentPath) => {
	const routeSegments = routePath.split("/").filter(Boolean);
	const currentSegments = currentPath.split("/").filter(Boolean);

	if (routeSegments.length !== currentSegments.length) {
		return null;
	}

	const params = {
		is: false,
	};

	for (let i = 0; i < routeSegments.length; i++) {
		if (routeSegments[i].startsWith(":")) {
			const paramName = routeSegments[i].slice(1);

			params[paramName] = "";
			if (currentSegments[i]) {
				params[paramName] = currentSegments[i];
			}

			params.is = true;
		} else if (routeSegments[i] !== currentSegments[i]) {
			return null;
		}
	}

	return { params };
};

export const setRenderRouterCallback = (callback) => {
	renderer = callback;
};

export const configs = (newConfigs) => {
	routesConfigs = { ...routesConfigs, ...newConfigs };
};
