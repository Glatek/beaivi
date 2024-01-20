import { resolve } from "path";
import { defineConfig } from "vite";

import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.js"),
			formats: ["es"],
			fileName: "index",
		},
		target: "es2022",
		minify: "esbuild",
	},
	plugins: [
		dts({
			compilerOptions: {
				checkJs: true,
				allowJs: true,
			},
		}),
	],
});
