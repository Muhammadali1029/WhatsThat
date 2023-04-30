module.exports = {
  env:
  {
    browser: true,
    es2021: true,
  },
  extends:
  [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides:
  [
  ],
  parserOptions:
  {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins:
  [
    'react',
  ],
  rules:
  {
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'brace-style': ['error', 'allman'],
    'react/prefer-stateless-function': ['error', { ignorePureComponents: false }],
    'consistent-return': 'off',
    'no-console': 'off',
    'no-throw-literal': 'off',
    'no-use-before-define': ['error', { variables: false }],
  },
};
