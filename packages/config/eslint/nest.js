/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve('./base.js')],
  rules: {
    // NestJS often uses decorators with any
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
