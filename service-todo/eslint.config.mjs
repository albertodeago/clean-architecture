import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { projectStructurePlugin } from "eslint-plugin-project-structure";
// import { independentModulesConfig } from "./independentModules.mjs";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // global rule, what do ignore
    ignores: ["**/dist"]
  },
  {
    // global rule, which files to check
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  { 
    languageOptions: { 
      globals: globals.browser 
    } 
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
           * - contains the errors and models of the domain
           * - they can't have external dependencies
           * Utils and Config
           * - contains utility functions and config
           * - they can't have external dependencies (but can be imported by everything else)
           * Infrastructure
           * - contains the implementation of the adapters (domain ports)
           * - can import from domain, utils and config
           * - imports also the application layer as it needs to expose the ports to the outside world (http in this case)
           *   TODO: not sure about sentence above, we have this dep because of the http implementation, but that's not a domain port implementation, 
           *   it's an external dependency adapter (express in this case). If we move this kind of adapters in it's own folder, we should be able to remove this dep
           * Application
           * - contains the implementation of the use cases (business logic)
           * - imports from domain and utils, receive in input the infrastructure ports (implementations, so the dependency is still towards the domain) 
           *   and use them to implement the business logic
           */
          modules: [
            {
              // Config can't import anything
              name: "Domain folder",
              pattern: "src/config/**",
              errorMessage:
                "🔥 Config can't import anything 🔥",
              allowImportsFrom: [],
            },
            {
              // utils -> can't import stuff outisde of utils
              name: "Utils folder",
              pattern: "src/utils/**",
              errorMessage:
                "🔥 The `utils` folder cannot import items from outside of it. 🔥",
              allowImportsFrom: ["src/utils/**"],
            },
            {
              // domain -> can't import stuff outisde of domain, except utils
              name: "Domain folder",
              pattern: "src/domain/**",
              errorMessage:
                "🔥 The `domain` folder cannot import items from outside of it. 🔥",
              allowImportsFrom: ["src/domain/**", "src/utils/**"],
            },
            {
              // infrastructure -> should import domain and application
              name: "Infrastructure folder",
              pattern: "src/infrastructure/**",
              errorMessage:
                "🔥 The `infrastructure` folder can only import from `domain`, `application`, `utils` and `config`. 🔥",
              allowImportsFrom: ["src/domain/**", "src/application/**", "src/utils/**", "src/config/**"],
            },
            {
              // application -> can only import from domain, utils and config
              name: "Application folder",
              pattern: "src/application/**",
              errorMessage:
                "🔥 The `application` folder can only import from `domain`, `utils` and `config`. 🔥",
              allowImportsFrom: ["src/domain/**", "src/utils/**", "src/config/**"],
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
  }
];