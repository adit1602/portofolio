/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve('@portfolio/config/eslint/next')],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
}
