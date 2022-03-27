module.exports = {
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: 'build',
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    // Baseline configurations
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',

    // Disable ESLint rules conflicting with Prettier
    'prettier',
    'prettier/prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-unused-vars': 'off',
  },
}
