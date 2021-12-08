module.exports = {
  root: true,
  ignorePatterns: ["fauna/**"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: {
    node: true,
  },
  rules: {
    "max-len": [
      "error",
      {
        code: 300,
      },
    ],
  },
};
