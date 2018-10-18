module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      modules: true
    },
    sourceType: "module"
  },
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
    node: true
  },
  globals: {
    angular: false,
    define: false,
    document: false,
    require: false
  },
  rules: {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "object-curly-spacing": ["error", "always"],
    "max-lines": ["warn", 300],
    "max-len": ["warn", 120],
    "no-console": ["warn"],
    "no-mixed-operators": ["warn", {
      "groups": [
        ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
        ["&&", "||"],
        ["in", "instanceof"]
      ],
      "allowSamePrecedence": true
    }],
    "no-multi-spaces": ["error"],
    "no-cond-assign": ["warn"],
    "no-fallthrough": ["warn"],
    "no-undef": ["warn"],
    "no-unused-vars": ["warn"],
    "no-use-before-define": ["warn", { "functions": false, "classes": false, "variables": false }],
    "no-useless-escape": ["warn"],
    "no-useless-return": ["warn"],
    "no-underscore-dangle": ["warn", { "allow": ["_id"] }],
    "no-redeclare": ["warn"],
    "no-restricted-syntax": ["warn"],
    "operator-linebreak": ["warn", "before"],
    "prefer-promise-reject-errors": ["warn"],
    "padded-blocks": ["warn", { "blocks": "never", "switches": "never", "classes": "never" }],
    "semi": ["error", "always"],
    "valid-typeof": ["warn"]
  },
  extends: [
    "eslint:recommended"
  ]
}
