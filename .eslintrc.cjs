/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "tsconfig.eslint.json",
    "ecmaVersion": "latest"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting"
  ],
  "ignorePatterns": [
    "grammar.ts",
    "*.config.js",
    "*.config.ts",
    ".eslintrc.cjs",
    "test.*.ts"
  ],
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [
          ".tsx",
        ]
      }
    }
  },
  "overrides": [
    {
      "files": [
        "**/*.*"
      ],
      "rules": {
        "import/no-unused-modules": "off"
      }
    }
  ],
  "rules": {
    "max-len": [
      "warn",
      120
    ],
    "linebreak-style": "off",
    "max-classes-per-file": [
      "warn",
      1
    ],
    "quotes": "off",
    "@typescript-eslint/quotes": [
      "warn",
      "backtick",
      {
        "avoidEscape": true
      }
    ],
    "prefer-destructuring": "off",
    "arrow-parens": [
      "warn",
      "as-needed",
      {
        "requireForBlockBody": false
      }
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": [
      "error",
      {
        "variables": false, // ????
        "classes": false
      }
    ],
    "no-multi-spaces": [
      "warn",
      {
        "ignoreEOLComments": true
      }
    ],
    "no-param-reassign": "off",
    "object-curly-spacing": "off",
    "@typescript-eslint/object-curly-spacing": [
      "error",
      "never"
    ],
    "object-curly-newline": "off",
    "no-underscore-dangle": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "only-multiline"
      }
    ],
    "lines-between-class-members": "off",
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        "selector": "typeLike",
        "format": [
          "PascalCase"
        ],
        "leadingUnderscore": "allow",
      }
    ],
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/lines-between-class-members": [
      "error",
      "always",
      {
        "exceptAfterSingleLine": true
      }
    ]
  }
}
