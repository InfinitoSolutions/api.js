/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint. 
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    "env": {
        "es6": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/dot-notation": "error",
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                "accessibility": "no-public"
            }
        ],
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/naming-convention": "error",
        "@typescript-eslint/no-param-reassign": "error",
        "@typescript-eslint/promise-function-async": "error",
        "arrow-body-style": "error",
        "complexity": "error",
        "curly": [
            "error",
            "multi-line"
        ],
        "default-case": "error",
        "eqeqeq": [
            "error",
            "always"
        ],
        "import/no-extraneous-dependencies": "off",
        "import/order": "error",
        "no-console": "error",
        "no-duplicate-imports": "error",
        "no-magic-numbers": "error",
        "no-return-await": "error",
        "no-undef-init": "error",
        "prefer-const": "error",
        "prefer-template": "error",
        "use-isnan": "error"
    }
};
