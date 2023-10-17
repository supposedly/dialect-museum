module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    `eslint:recommended`,
    `plugin:@typescript-eslint/recommended`,
    `plugin:vue/vue3-essential`,
  ],
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': [
        `.eslintrc.{js,cjs}`,
      ],
      'parserOptions': {
        'sourceType': `script`,
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': `latest`,
    'parser': `@typescript-eslint/parser`,
    'sourceType': `module`,
  },
  'ignorePatterns': [
    `grammar.ts`,
    `*.config.js`,
    `*.config.ts`,
    `.eslintrc.cjs`,
    `test.*.ts`,
  ],
  'plugins': [
    `@typescript-eslint`,
    `vue`,
  ],
  'rules': {
    'indent': [
      `warn`,
      2,
      {
        'SwitchCase': 1,
      },
    ],
    'linebreak-style': [
      `warn`,
      `windows`,
    ],
    'quotes': [
      `warn`,
      `backtick`,
    ],
    'semi': [
      `warn`,
      `always`,
    ],
    'max-len': [
      `warn`,
      120,
    ],
    'max-classes-per-file': [
      `warn`,
      1,
    ],
    '@typescript-eslint/quotes': [
      `warn`,
      `backtick`,
      {
        'avoidEscape': true,
      },
    ],
    'prefer-destructuring': `off`,
    'arrow-parens': [
      `warn`,
      `as-needed`,
      {
        'requireForBlockBody': false,
      },
    ],
    'no-use-before-define': `off`,
    '@typescript-eslint/no-use-before-define': [
      `error`,
      {
        'variables': false, // ????
        'classes': false,
      },
    ],
    'no-multi-spaces': [
      `warn`,
      {
        'ignoreEOLComments': true,
      },
    ],
    'no-param-reassign': `off`,
    'object-curly-spacing': `off`,
    "@typescript-eslint/object-curly-spacing": [
      `error`,
      `never`,
    ],
    'object-curly-newline': `off`,
    'no-underscore-dangle': `off`,
    'no-unused-vars': `off`,
    '@typescript-eslint/no-unused-vars': [
      `warn`,
      {
        'argsIgnorePattern': `^_`,
      },
    ],
    'comma-dangle': [
      `error`,
      {
        'arrays': `always-multiline`,
        'objects': `always-multiline`,
        'imports': `always-multiline`,
        'exports': `always-multiline`,
        'functions': `only-multiline`,
      },
    ],
    'lines-between-class-members': `off`,
    '@typescript-eslint/naming-convention': [
      `warn`,
      {
        'selector': `typeLike`,
        'format': [
          `PascalCase`,
        ],
        'leadingUnderscore': `allow`,
      },
    ],
    '@typescript-eslint/indent': `off`,
    '@typescript-eslint/lines-between-class-members': [
      `error`,
      `always`,
      {
        'exceptAfterSingleLine': true,
      },
    ],
  },
};
