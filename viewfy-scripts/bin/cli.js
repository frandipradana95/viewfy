#!/usr/bin/env node

const yargs = require("yargs");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const webpackConfig = require("../webpack.config");

yargs
	.command(
		"start",
		"Start the development server",
		(yarg) => {
			yarg.option("port", {
				alias: "p",
				type: "number",
				description: "Set the port for the dev server",
				default: 3000,
			});
		},
		async (argv) => {
			const config = {
				...webpackConfig,
				devServer: {
					...webpackConfig.devServer,
					port: argv.port,
				},
			};

			const compiler = webpack(config);
			const server = new webpackDevServer(config.devServer, compiler);

			await server.start(argv.port, "localhost", () => {
				console.log(`Dev Server started on "https://localhost:${argv.port}`);
			});
		}
	)
	.help().argv;
