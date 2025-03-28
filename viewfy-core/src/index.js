import { createEffect } from "./createEffect";
import { createElement } from "./createElement";
import { createState } from "./createState";
import { createStore } from "./createStore";
import { createStyle, createStyleGlobals } from "./createStyle";
import { render } from "./renderVirtualNode";
import { configs, getParameters, Link, Route, Router } from "./routers";

const Viewfy = {
	createEffect,
	createElement,
	createState,
	createStore,
	createStyle,
	createStyleGlobals,
	render,
	Router,
	Route,
	Link,
	getParameters,
	routerConfigs: { configs },
};

export {
	createEffect,
	createElement,
	createState,
	createStore,
	createStyle,
	createStyleGlobals,
	render,
	Router,
	Route,
	Link,
	getParameters,
};

export default Viewfy;
