const path = require("path");

module.exports = {
	entry: "./src/index.js", // File utama
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "viewfy-core.js",
		library: "Viewfy",
		libraryTarget: "umd", // Bisa digunakan di Node.js & browser
		globalObject: "this",
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/, // Mendukung JS & JSX
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},
	resolve: {
		extensions: [".js", ".jsx"], // Bisa import tanpa menulis ekstensi
	},
	mode: "production",
};
