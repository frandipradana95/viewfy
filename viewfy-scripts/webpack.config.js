const path = require("path");

const cwd = process.cwd();

module.exports = {
	entry: path.resolve(cwd, "src/index.js"),
	output: {
		path: path.resolve(cwd, "dist"),
		filename: "bundle.js",
	},
	devServer: {
		port: 3000,
		hot: true,
		open: true,
		static: path.resolve(cwd, "public"),
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: "babel_loader",
			},
			{
				test: /\.html$/,
				use: "html-loader",
			},
		],
	},
};
