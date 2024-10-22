import pluginJs from '@eslint/js';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginNode from 'eslint-plugin-node';
import globals from 'globals';

const jsdocRules = {
  'jsdoc/require-jsdoc': [
    'error',
    {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true,
        FunctionExpression: true,
      },
    },
  ],
  'jsdoc/require-description': 'error',
  'jsdoc/require-param': 'error',
  'jsdoc/require-param-type': 'error',
  'jsdoc/require-param-description': 'error',
  'jsdoc/require-returns': 'error',
  'jsdoc/require-returns-type': 'error',
  'jsdoc/require-returns-description': 'error',
  'jsdoc/check-types': 'error',
};

const nodeRules = {
  'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  'no-console': ['error'],
  'node/no-unsupported-features/es-syntax': 'off',
};

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
    plugins: {
      jsdoc: pluginJsdoc,
      node: pluginNode,
    },
    rules: {
      ...jsdocRules,
      ...nodeRules,
    },
  },
  pluginJs.configs.recommended,
];
