module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "google",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module",
    },
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
    ],
    plugins: [
        "@typescript-eslint",
        "import",
    ],
    rules: {
        "quotes": ["error", "double"],
        "import/no-unresolved": 0,
        "object-curly-spacing": ["error", "always"],
        "semi": 0,
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "eol-last": 0,
        "max-len": ["error", {
            "comments": 150,
            "code": 100,
        }],
        "padded-blocks": 0,
    },
};
