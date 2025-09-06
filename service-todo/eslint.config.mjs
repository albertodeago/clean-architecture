import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { projectStructurePlugin } from "eslint-plugin-project-structure";
// import { independentModulesConfig } from "./independentModules.mjs";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		// global rule, what do ignore
		ignores: ["**/dist", "**/coverage"],
	},
	{
		// global rule, which files to check
		files: ["**/*.{js,mjs,cjs,ts}"],
	},
	{
		languageOptions: {
			globals: globals.browser,
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		// Ensure that files don't import stuff that they shouldn't. This enable
		// us to have a better dependency management (e.g. domain can't import stuff outside of it)
		files: ["**/*.ts"],
		plugins: {
			"project-structure": projectStructurePlugin,
		},
		rules: {
			// If you have many rules in a separate file.
			// "project-structure/independent-modules": [
			//   "error",
			//   independentModulesConfig,
			// ],
			// If you have only a few rules.
			"project-structure/independent-modules": [
				"error",
				{
					/**
					 * Modules are folders, and we want to ensure that they can only import from allowed folders
					 * Domain
					 * - contains the errors, models and the use-cases of the domain
					 * - they can't have external dependencies
					 * Config
					 * - contains config (interfacing with process.env and similar)
					 * - they can't have external dependencies (but can be imported by everything else)
					 * Adapters
					 * - contains the implementation of the adapters (domain ports)
					 * - can import from domain, config
					 * Env
					 * - build all the adapters
					 * - can import from domain, config, adapters
					 */
					modules: [
						{
							// Config can't import anything
							name: "Config folder",
							pattern: "src/config.ts",
							errorMessage: "🔥 Config can't import anything 🔥",
							allowImportsFrom: [],
						},
						{
							// env -> can't import stuff outside of env, except utils
							name: "Env folder",
							pattern: "src/env.ts",
							errorMessage:
								"🔥 The `env` folder can import domains, adapters and config 🔥",
							allowImportsFrom: [
								"src/env.ts",
								"src/domain/**",
								"src/adapters/**",
								"src/config.ts",
							],
						},
						{
							// domain -> can't import stuff outsde of domain, except utils
							name: "Domain folder",
							pattern: "src/domain/**",
							errorMessage:
								"🔥 The `domain` folder cannot import items from outside of it. 🔥",
							allowImportsFrom: ["src/domain/**"],
						},
						{
							// adapters / infrastructure -> should import domain and application
							name: "Adapters folder",
							pattern: "src/adapters/**",
							errorMessage:
								"🔥 The `adapters` folder can only import from `domain`, `application`, and `config`. 🔥",
							allowImportsFrom: [
								"src/domain/**",
								"src/application/**",
								"src/config.ts",
							],
						},

						{
							// test -> can import from everything
							name: "Test folder",
							pattern: "test/**",
							allowImportsFrom: ["**"],
						},

						// All files not specified in the rules are not allowed to import anything. Ignore all non-nested files in the `src` folder.
						{
							// All files not specified in the rules are not allowed to import anything, this way, just in case we catch something in advance
							name: "Unknown files",
							pattern: [["**", "!src/*"]],
							allowImportsFrom: [],
							allowExternalImports: false,
							errorMessage:
								"🔥 This file is not specified as an independent module in the eslint config. 🔥",
						},

						// {
						//   // THIS IS AN EXAMPLE FROM THE DOCS, this stuff is powerful man
						//   name: "Features",
						//   pattern: "src/features/**",
						//   errorMessage:
						//     "🔥 A feature may only import items from... Importing items from another feature is prohibited. 🔥",
						//   allowImportsFrom: [
						//     // /*  = wildcard.
						//     // /*/  = wildcard for current directory.
						//     // /**/ = wildcard for nested directories.

						//     "src/features/*/*.tsx",
						//     // Let's assume we are in the "features/Feature1/Feature1.tsx".
						//     // In this case we will be able to import:
						//     // "features/Feature2/Feature2.tsx"
						//     // But we won't be able to import Feature1 private files and folders.

						//     // {family} reference finds the common part between the import and the current file.
						//     // By default, at least two common path parts are required, baseUrl is not taken into account.
						//     // This will make your rule work recursively/apply to all nestings.
						//     // You can change the number of common path parts required, {family_1} at least 1, {family_3} at least 3 common part etc.

						//     "{family}/**",
						//     // Let's assume we are in the "features/Feature1/Feature1.tsx".
						//     // In this case we will be able to import:
						//     // "features/Feature1/feature1.types.ts"             ({family} === "features/Feature1")
						//     // "features/Feature1/feature1.api.ts"               ({family} === "features/Feature1")
						//     // "features/Feature1/components/SimpleComponent.tsx" ({family} === "features/Feature1")

						//     "src/shared/**",
						//   ],
						// },
					],
				},
			],
		},
	},
];
