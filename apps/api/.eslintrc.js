/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve('@portfolio/config/eslint/nest')],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
}
