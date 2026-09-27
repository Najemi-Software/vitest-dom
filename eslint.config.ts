import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { plugin as typescriptPlugin, parser as typescriptParser } from "typescript-eslint";

export default defineConfig(
    {
        // glob patterns for files that should be ignored
        ignores: ["esm/**"],
    },
    {
        // primary configuration (eslint rules)
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2022,
            },
            sourceType: "module",
            ecmaVersion: 2022,
        },
        rules: {
            "array-callback-return": "warn",
            "getter-return": "warn",
            "new-parens": "warn",
            "no-array-constructor": "warn",
            "no-caller": "error",
            "no-cond-assign": ["warn", "except-parens"],
            "no-const-assign": "error",
            "no-control-regex": "warn",
            "no-dupe-args": "warn",
            "no-dupe-class-members": "warn",
            "no-dupe-keys": "warn",
            "no-duplicate-case": "warn",
            "no-empty-character-class": "warn",
            "no-empty-pattern": "warn",
            "no-empty": ["warn", { allowEmptyCatch: true }],
            "no-eval": "error",
            "no-ex-assign": "warn",
            "no-extend-native": "warn",
            "no-extra-bind": "warn",
            "no-extra-label": "warn",
            "no-extra-boolean-cast": "warn",
            "no-func-assign": "error",
            "no-global-assign": "error",
            "no-implied-eval": "warn",
            "no-invalid-regexp": "warn",
            "no-label-var": "warn",
            "no-labels": ["warn", { allowLoop: true, allowSwitch: false }],
            "no-lone-blocks": "warn",
            "no-loop-func": "warn",
            "no-mixed-operators": [
                "warn",
                {
                    groups: [
                        ["&", "|", "^", "~", "<<", ">>", ">>>"],
                        ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                        ["&&", "||"],
                        ["in", "instanceof"],
                    ],
                    allowSamePrecedence: false,
                },
            ],
            "no-unsafe-negation": "warn",
            "no-new-func": "warn",
            "no-new-object": "warn",
            "no-octal": "warn",
            "no-redeclare": "error",
            "no-script-url": "warn",
            "no-self-assign": "warn",
            "no-self-compare": "warn",
            "no-sequences": "warn",
            "no-shadow-restricted-names": "warn",
            "no-sparse-arrays": "warn",
            "no-template-curly-in-string": "warn",
            "no-this-before-super": "warn",
            "no-undef": "error",
            "no-unreachable": "warn",
            "no-unused-expressions": [
                "warn",
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true,
                },
            ],
            "no-unused-labels": "warn",
            // "no-unused-vars": [
            //   "warn",
            //   {
            //     args: "none",
            //     ignoreRestSiblings: true,
            //   },
            // ],
            "no-use-before-define": ["warn", { classes: false, functions: false, variables: false }],
            "no-useless-computed-key": "warn",
            "no-useless-concat": "warn",
            "no-useless-constructor": "warn",
            "no-useless-escape": "warn",
            "no-useless-rename": [
                "warn",
                {
                    ignoreDestructuring: false,
                    ignoreImport: false,
                    ignoreExport: false,
                },
            ],
            "require-yield": "warn",
            "use-isnan": "warn",
            "valid-typeof": "warn",
        },
    },
    {
        // eslint-plugin-import configuration
        plugins: {
            import: importPlugin,
        },
        settings: {
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                },
                typescript: {
                    alwaysTryTypes: true,
                },
            },
        },
        rules: {
            "import/first": "error",
            "import/no-amd": "error",
            "import/no-webpack-loader-syntax": "error",
        },
    },
    {
        // TypeScript configuration
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                warnOnUnsupportedTypeScriptVersion: true,
            },
        },
        plugins: {
            "@typescript-eslint": typescriptPlugin,
        },
        extends: [
            {
                ...importPlugin.flatConfigs.typescript,
                plugins: {},
            },
        ],
        rules: {
            "no-dupe-class-members": "off",
            "no-undef": "off",

            // Add TypeScript specific rules (and turn off ESLint equivalents)
            "@typescript-eslint/consistent-type-assertions": "warn",
            "@typescript-eslint/consistent-type-imports": "warn",

            "no-array-constructor": "off",
            "@typescript-eslint/no-array-constructor": "warn",

            "no-redeclare": "off",
            "@typescript-eslint/no-redeclare": "error",

            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": [
                "warn",
                {
                    functions: false,
                    classes: false,
                    variables: false,
                    typedefs: false,
                },
            ],
            "no-unused-expressions": "off",
            // "@typescript-eslint/no-unused-expressions": [
            //   "warn",
            //   {
            //     allowShortCircuit: true,
            //     allowTernary: true,
            //     allowTaggedTemplates: true,
            //   },
            // ],
            // "no-unused-vars": "off",
            // "@typescript-eslint/no-unused-vars": [
            //   "warn",
            //   {
            //     args: "none",
            //     ignoreRestSiblings: true,
            //   },
            // ],
            "no-useless-constructor": "off",
            "@typescript-eslint/no-useless-constructor": "warn",
        },
    },
);
