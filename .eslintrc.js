module.exports = {
  root: true,
  extends: ["plugin:prettier/recommended"],
  parser: "babel-eslint",
  rules: {
    "arrow-parens": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true,
  },
};
