
/* eslint max-lines: ['error', {max: 1000, skipBlankLines: true, skipComments: true}] */

const prettierConfig = require('@sugar-candy-framework/prettier-config');

/**
 * Configuration file for the ESLint utility (https://eslint.org)
 */

module.exports = {
  // Prevent ESLint from checking our ancestor directories for additional
  // configuration files.
  root: true,

  // Override the default parser with one that supports linting of all valid
  parser: '@babel/eslint-parser',

  plugins: ['import', 'react', 'react-hooks', 'jsx-a11y', 'unicorn', 'spellcheck', 'prettier'],

  // https://github.com/yannickcr/eslint-plugin-react#configuration
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx']
      }
    },
    'import/extensions': ['.js', '.jsx'],
    'import/core-modules': [],
    'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg)$'],
    react: {
      pragma: 'React',
      version: '16.8' // should this be detect
    },
    // TODO: we seem to need this setting?
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      {name: 'Link', linkAttribute: 'href'}
    ]
  },

  // Support ECMAScript 9, including JSX syntax. Assume all code is in ES modules.
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module'
  },

  // Support new ES2020 global variables.
  env: {es2021: true},

  // Assume "console" is globally defined.
  globals: {
    console: true,
    __ENABLE_USER_TIMING_API__: true,
    __OCC_DEV__: true
  },

  // Start with the ESLint recommended set of rules (those rules accompanied by
  // check marks in https://eslint.org/docs/rules/)
  extends: [
    'eslint:recommended', // https://github.com/eslint/eslint/blob/master/conf/eslint-recommended.js
    'plugin:import/recommended', // https://github.com/benmosher/eslint-plugin-import/blob/master/config/recommended.js
    'plugin:react/recommended', // https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js
    'plugin:jsx-a11y/recommended', // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/src/index.js
    // Not going for unicorn recommended config, handpicking rules we just need
    // 'plugin:unicorn/recommended', // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/index.js
    // prettier config will switch off all conflicting and bad style rules that are configured in earlier layers.
    'prettier' // https://github.com/prettier/eslint-config-prettier#eslint-config-prettier-
  ],

  // Apply the following additional rules.
  rules: {
    /**
     * OOTB eslint:recommended rules list and config.
     * 'constructor-super': 'error',
     * 'for-direction': 'error',
     * 'getter-return': 'error',
     * 'no-async-promise-executor': 'error',
     * 'no-case-declarations': 'error',
     * 'no-class-assign': 'error',
     * 'no-compare-neg-zero': 'error',
     * 'no-cond-assign': 'error',
     * 'no-const-assign': 'error',
     * 'no-constant-condition': 'error',
     * 'no-control-regex': 'error',
     * 'no-debugger': 'error',
     * 'no-delete-var': 'error',
     * 'no-dupe-args': 'error',
     * 'no-dupe-class-members': 'error',
     * 'no-dupe-keys': 'error',
     * 'no-duplicate-case': 'error',
     * 'no-empty': 'error',
     * 'no-empty-character-class': 'error',
     * 'no-empty-pattern': 'error',
     * 'no-ex-assign': 'error',
     * 'no-extra-boolean-cast': 'error',
     * 'no-extra-semi': 'error',
     * 'no-fallthrough': 'error',
     * 'no-func-assign': 'error',
     * 'no-global-assign': 'error',
     * 'no-inner-declarations': 'error',
     * 'no-invalid-regexp': 'error',
     * 'no-irregular-whitespace': 'error',
     * 'no-misleading-character-class': 'error',
     * 'no-mixed-spaces-and-tabs': 'error',
     * 'no-new-symbol': 'error',
     * 'no-obj-calls': 'error',
     * 'no-octal': 'error',
     * 'no-prototype-builtins': 'error',
     * 'no-redeclare': 'error',
     * 'no-regex-spaces': 'error',
     * 'no-self-assign': 'error',
     * 'no-shadow-restricted-names': 'error',
     * 'no-sparse-arrays': 'error',
     * 'no-this-before-super': 'error',
     * 'no-undef': 'error',
     * 'no-unexpected-multiline': 'error',
     * 'no-unreachable': 'error',
     * 'no-unsafe-finally': 'error',
     * 'no-unsafe-negation': 'error',
     * 'no-unused-labels': 'error',
     * 'no-unused-vars': 'error',
     * 'no-useless-catch': 'error',
     * 'no-useless-escape': 'error',
     * 'no-with': 'error',
     * 'require-atomic-updates': 'error',
     * 'require-yield': 'error',
     * 'use-isnan': 'error',
     * 'valid-typeof': 'error'
     */

    /**
     * Rules overlaid from eslint-config-cfw-base core.js
     */

    // If an object property has a setter, also require a getter.
    // https://eslint.org/docs/rules/accessor-pairs
    'accessor-pairs': 'error',

    // enforces return statements in callbacks of array's methods
    // https://eslint.org/docs/rules/array-callback-return
    'array-callback-return': ['error', {allowImplicit: true}],

    // enforce that class methods use "this"
    // https://eslint.org/docs/rules/class-methods-use-this
    // overridden in react config to exclude react methods
    // 'class-methods-use-this': ['error', {exceptMethods: []}],

    // Require non-constant variables, properties, and functions to be named
    // using camelCase.
    camelcase: 'error',

    // require return statements to either always or never specify values
    'consistent-return': 'off',

    // Require curly braces around single-line blocks, even though they're optional.
    // https://eslint.org/docs/rules/curly
    // https://github.com/prettier/eslint-config-prettier#curly
    // Conflicts with prettier and switched off in prettier config layer
    // curly: 'error',

    // require default case in switch statements
    /* ```
    switch(a) {
    case 1:
      // code ...
      break;
    // skip default ```
    }
    */
    'default-case': ['error', {commentPattern: '^skip default$'}],

    // encourages use of dot notation whenever possible
    // Conflicts with prettier and switched off in prettier config layer
    // 'dot-notation': ['error', {allowKeywords: true}],

    // enforces consistent newlines before or after dots
    // https://eslint.org/docs/rules/dot-location
    // Conflicts with prettier and switched off in prettier config layer
    // 'dot-location': ['error', 'property'],

    // require the use of === and !==
    // https://eslint.org/docs/rules/eqeqeq
    // Require comparison to use === or !== except when comparing two literal
    // values, evaluating the value of "typeof", or comparing against null.
    eqeqeq: ['error', 'smart'],

    // make sure for-in loops have an if statement to avoid looping over inherited props
    // https://eslint.org/docs/rules/guard-for-in
    'guard-for-in': 'off',

    // enforce a maximum number of classes per file
    // https://eslint.org/docs/rules/max-classes-per-file
    /**
     * class Private {
     * ...
     * }
     *
     * export class Public {
     *   // Private instances and reference
     *   // ...
     * }
     */
    'max-classes-per-file': 'off',

    //  enforces a maximum number of lines per file, in order to aid in maintainability and reduce complexity.
    'max-lines': ['error', {max: 600, skipBlankLines: true, skipComments: true}],

    // disallow the use of alert, confirm, and prompt
    'no-alert': 'error',

    // disallow using an async function as a Promise executor
    // https://eslint.org/docs/rules/no-async-promise-executor
    'no-async-promise-executor': 'error', // eslint recommended sets this to error

    // TODO: [2019-11-10](ragkiran, rramasam, ssmyth, jviszmeg) Should this be disabled for us and error for Marcus?
    // Disallow await inside of loops
    // https://eslint.org/docs/rules/no-await-in-loop
    'no-await-in-loop': 'off',

    // disallow use of arguments.caller or arguments.callee
    'no-caller': 'error',

    // disallow lexical declarations in case/default clauses
    // https://eslint.org/docs/rules/no-case-declarations.html
    // eslint:recommended 'no-case-declarations': 'error',

    // Disallow comparisons to negative zero
    // https://eslint.org/docs/rules/no-compare-neg-zero
    // eslint:recommended 'no-compare-neg-zero': 'error',

    // disallow assignment in conditional expressions
    // eslint:recommended 'no-cond-assign': ['error', 'always'],

    // TODO: [2019-11-10](ragkiran, rramasam, ssmyth, jviszmeg) Should this be disabled for us and error for Marcus?
    // disallow use of console, overridden from eslint config recommended
    'no-console': 'off',

    // disallow use of constant expressions in conditions
    // eslint:recommended 'no-constant-condition': 'warn',

    // disallow control characters in regular expressions
    // eslint:recommended 'no-control-regex': 'error',

    // disallow use of debugger
    // eslint:recommended 'no-debugger': 'error',

    // disallow deletion of variables
    // eslint:recommended 'no-delete-var': 'error',

    // disallow duplicate arguments in functions
    // eslint:recommended 'no-dupe-args': 'error',

    // disallow duplicate keys when creating object literals
    // eslint:recommended 'no-dupe-keys': 'error',

    // disallow a duplicate case label.
    // eslint:recommended 'no-duplicate-case': 'error',

    // disallow else after a return in an if
    // https://eslint.org/docs/rules/no-else-return
    'no-else-return': ['error', {allowElseIf: false}],

    // disallow empty statements
    // eslint:recommended 'no-empty': 'error',

    // disallow the use of empty character classes in regular expressions
    // eslint:recommended 'no-empty-character-class': 'error',

    // disallow empty functions, except for standalone functions/arrows
    // https://eslint.org/docs/rules/no-empty-function
    'no-empty-function': ['error', {allow: ['arrowFunctions', 'functions', 'methods']}],

    // disallow empty destructuring patterns
    // https://eslint.org/docs/rules/no-empty-pattern
    // eslint:recommended 'no-empty-pattern': 'error',

    // disallow use of eval()
    'no-eval': 'error',

    // disallow assigning to the exception in a catch block
    // eslint:recommended 'no-ex-assign': 'error',

    // disallow adding to native types
    'no-extend-native': 'error',

    // disallow unnecessary function binding
    'no-extra-bind': 'error',

    // disallow double-negation boolean casts in a boolean context
    // https://eslint.org/docs/rules/no-extra-boolean-cast
    // eslint:recommended 'no-extra-boolean-cast': 'error',

    // disallow Unnecessary Labels
    // https://eslint.org/docs/rules/no-extra-label
    'no-extra-label': 'error',

    // disallow unnecessary semicolons
    // eslint:recommended 'no-extra-semi': 'error',

    // disallow fall through of case statements
    // eslint:recommended 'no-fallthrough': 'error',

    // disallow the use of leading or trailing decimal points in numeric literals
    // Conflicts with prettier and switched off in prettier config layer
    // 'no-floating-decimal': 'error',

    // disallow overwriting functions written as function declarations
    // eslint:recommended 'no-func-assign': 'error',

    // disallow reassignments of native objects or read-only globals
    // https://eslint.org/docs/rules/no-global-assign
    // eslint:recommended 'no-global-assign': ['error', {exceptions: []}],

    // TODO: [2019-11-10](ragkiran, rramasam, ssmyth, jviszmeg) do we stick to this?
    // disallow implicit type conversions
    // https://eslint.org/docs/rules/no-implicit-coercion
    'no-implicit-coercion': [
      'error',
      {
        boolean: false,
        number: true,
        string: true,
        allow: []
      }
    ],

    // disallow use of eval()-like methods
    'no-implied-eval': 'error',

    // disallow function or variable declarations in nested blocks
    // eslint:recommended 'no-inner-declarations': 'error',

    // disallow invalid regular expression strings in the RegExp constructor
    // eslint:recommended 'no-invalid-regexp': 'error',

    // disallow irregular whitespace outside of strings and comments
    // eslint:recommended 'no-irregular-whitespace': 'error',

    // disallow usage of __iterator__ property
    'no-iterator': 'error',

    // disallow use of labels for anything other then loops and switches
    'no-labels': ['error', {allowLoop: false, allowSwitch: false}],

    // disallow unnecessary nested blocks
    'no-lone-blocks': 'error',

    // disallow creation of functions within loops
    'no-loop-func': 'error',

    // Disallow characters which are made with multiple code points in character class syntax
    // https://eslint.org/docs/rules/no-misleading-character-class
    // eslint:recommended 'no-misleading-character-class': 'error',

    // disallow use of multiple spaces
    // Conflicts with prettier and switched off in prettier config layer
    // 'no-multi-spaces': ['error', {ignoreEOLComments: false}],

    // disallow use of multiline strings
    'no-multi-str': 'error',

    // disallow use of new operator when not part of the assignment
    'no-new': 'error',

    // disallow use of the Buffer() constructor
    // https://eslint.org/docs/rules/no-buffer-constructor
    'no-buffer-constructor': 'error',

    // disallow use of new operator with the require function
    'no-new-require': 'error',

    // disallow string concatenation with __dirname and __filename cross platform file path separators and avoid confusion
    // https://eslint.org/docs/rules/no-path-concat
    'no-path-concat': 'error',

    // disallow use of new operator for Function object
    'no-new-func': 'error',

    // disallows creating new instances of String, Number, and Boolean
    'no-new-wrappers': 'error',

    // disallow use of (old style) octal literals
    // eslint:recommended 'no-octal': 'error',

    // disallow the use of object properties of the global object (Math and JSON) as functions
    // eslint:recommended 'no-obj-calls': 'error',

    // disallow use of octal escape sequences in string literals, such as
    // const foo = 'Copyright \251';
    'no-octal-escape': 'error',

    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    // rule: https://eslint.org/docs/rules/no-param-reassign
    // TODO: [2019-11-10](ragkiran, rramasam, ssmyth, jviszmeg) few violations, takes on this, do we need to add more exemptions?
    'no-param-reassign': 'off',

    // disallow usage of __proto__ property
    'no-proto': 'error',

    // disallow use of Object.prototypes builtins directly
    // https://eslint.org/docs/rules/no-prototype-builtins
    // eslint:recommended 'no-prototype-builtins': 'error',

    // disallow declaring the same variable more then once
    // eslint:recommended 'no-redeclare': 'error',

    // disallow multiple spaces in a regular expression literal
    // eslint:recommended 'no-regex-spaces': 'error',

    // disallow certain object properties
    // https://eslint.org/docs/rules/no-restricted-properties
    'no-restricted-properties': [
      'error',
      {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated'
      },
      {
        object: 'global',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead'
      },
      {
        object: 'self',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead'
      },
      {
        object: 'window',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead'
      },
      {
        object: 'global',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead'
      },
      {
        object: 'self',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead'
      },
      {
        object: 'window',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead'
      },
      {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.'
      },
      {
        property: '__defineSetter__',
        message: 'Please use Object.defineProperty instead.'
      },
      {
        object: 'Math',
        property: 'pow',
        message: 'Use the exponentiation operator (**) instead.'
      }
    ],

    // disallow use of assignment in return statement
    'no-return-assign': ['error', 'always'],

    // disallow redundant `return await`
    'no-return-await': 'error',

    // disallow use of `javascript:` urls.
    'no-script-url': 'error',

    // disallow self assignment, part of eslint:recommended, extending explicitly with props option
    // https://eslint.org/docs/rules/no-self-assign
    'no-self-assign': [
      'error',
      {
        props: true
      }
    ],

    // disallow comparisons where both sides are exactly the same
    'no-self-compare': 'error',

    // disallow use of comma operator
    'no-sequences': 'error',

    // disallow declaration of variables already declared in the outer scope
    'no-shadow': 'off',

    // disallow sparse arrays
    // eslint:recommended 'no-sparse-arrays': 'error',

    // Disallow template literal placeholder syntax in regular strings
    // https://eslint.org/docs/rules/no-template-curly-in-string
    'no-template-curly-in-string': 'error',

    // restrict what can be thrown as an exception
    //   throw new Error();  not  throw "Error!";
    'no-throw-literal': 'error',

    // Avoid code that looks like two expressions but is actually one
    // https://eslint.org/docs/rules/no-unexpected-multiline
    // eslint:recommended 'no-unexpected-multiline': 'error',

    // disallow unreachable statements after a return, throw, continue, or break statement
    // eslint:recommended 'no-unreachable': 'error',

    // disallow return/throw/break/continue inside finally blocks
    // https://eslint.org/docs/rules/no-unsafe-finally
    // eslint:recommended 'no-unsafe-finally': 'error',

    // disallow negating the left operand of relational operators
    // https://eslint.org/docs/rules/no-unsafe-negation
    // eslint:recommended 'no-unsafe-negation': 'error',

    // disallow useless computed property keys
    // https://eslint.org/docs/rules/no-useless-computed-key
    'no-useless-computed-key': 'error',

    // disallow usage of expressions in statement position
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: false
      }
    ],

    'no-unused-vars': ['error', {ignoreRestSiblings: true}],

    // disallow unused labels
    // https://eslint.org/docs/rules/no-unused-labels
    // eslint:recommended 'no-unused-labels': 'error',

    // disallow use of variables before they are defined
    'no-use-before-define': ['error', {functions: false, classes: true, variables: true}],

    // Disallow unnecessary catch clauses
    // https://eslint.org/docs/rules/no-useless-catch
    // eslint:recommended 'no-useless-catch': 'error',

    // disallow useless string concatenation
    // https://eslint.org/docs/rules/no-useless-concat
    'no-useless-concat': 'error',

    // disallow unnecessary string escaping
    // https://eslint.org/docs/rules/no-useless-escape
    // eslint:recommended 'no-useless-escape': 'error',

    // disallow redundant return; keywords
    // https://eslint.org/docs/rules/no-useless-return
    'no-useless-return': 'error',

    // disallow use of void operator
    // https://eslint.org/docs/rules/no-void
    'no-void': 'error',

    // require using Error objects as Promise rejection reasons
    // https://eslint.org/docs/rules/prefer-promise-reject-errors
    'prefer-promise-reject-errors': ['error', {allowEmptyReject: true}],

    // require use of the second argument for parseInt()
    radix: 'error',

    // Require strict mode directives.
    strict: ['error', 'safe'],

    // disallow comparisons with the value NaN
    // eslint:recommended 'use-isnan': 'error',

    // ensure that the results of typeof are compared against a valid string
    // https://eslint.org/docs/rules/valid-typeof
    // eslint:recommended 'valid-typeof': ['error', {requireStringLiterals: true}],

    // require immediate function invocation to be wrapped in parentheses
    // https://eslint.org/docs/rules/wrap-iife.html
    // Conflicts with prettier and switched off in prettier config layer
    // 'wrap-iife': ['error', 'outside', {functionPrototypeMethods: false}],

    // require or disallow Yoda conditions
    //   if (color === "red")  not  if ("red" === color)
    yoda: 'error',

    // Disallow the use of bitwise operators.
    'no-bitwise': 'error',

    // Disallow modifying variables that are class declarations.
    // eslint:recommended 'no-class-assign': 'error',

    // Disallow arrow functions where they could be confused with comparisons.
    // 'no-confusing-arrow': ['error', {allowParens: true}],

    // Disallow modifying variables that are declared using "const".
    // eslint:recommended 'no-const-assign': 'error',

    // Disallow a class member with the same name as another.
    // eslint:recommended 'no-dupe-class-members': 'error',

    // Require a single import statement per module.
    'no-duplicate-imports': 'error',

    // Disallow an if statement as the only statement in an else block.
    'no-lonely-if': 'error',

    // Disallow consecutive empty lines within a file or at the end of a file.
    // Conflicts with prettier and switched off in prettier config layer
    // 'no-multiple-empty-lines': ['error', {max: 1, maxEOF: 1}],

    // Disallow nested ternary expressions, such as:
    //   let foo = bar ? baz : qux === quxx ? bing : bam;
    'no-nested-ternary': 'error',

    // Disallow the use of the "new" operator with the Object constructor.
    'no-new-object': 'error',

    // Disallow the use of the "new" operator with the Symbol constructor.
    // eslint:recommended no-new-symbol': 'error',

    // Disallow shadowing of restricted names, e.g.:
    //   let undefined = 'foo';
    // eslint:recommended 'no-shadow-restricted-names': 'error',

    // Disallow use of this/super before calling super() in constructors.
    // eslint:recommended 'no-this-before-super': 'error',

    // Disallow trailing whitespace at the end of lines.
    // Conflicts with prettier and switched off in prettier config layer
    // 'no-trailing-spaces': 'error',

    // Disallow initializing variables to undefined.
    //   let foo;  not  let foo = undefined;
    'no-undef-init': 'error',

    // Disallow empty constructors.
    'no-useless-constructor': 'error',

    // disallow renaming import, export, and destructured assignments to the same name
    // https://eslint.org/docs/rules/no-useless-rename
    'no-useless-rename': [
      'error',
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false
      }
    ],

    // Require let or const instead of var.
    'no-var': 'error',

    // Disallow whitespace around the dot or before the opening bracket before properties of objects.
    //   foo.bar  not  foo .bar
    // Conflicts with prettier and switched off in prettier config layer
    // 'no-whitespace-before-property': 'error',

    // Disallow the use of "with" statements.
    // eslint:recommended 'no-with': 'error',

    // Disallow spaces directly inside of object-literal braces.
    //   {foo: 'bar'}  not  { foo: 'bar' }
    // Conflicts with prettier and switched off in prettier config layer
    // 'object-curly-spacing': 'error',

    // Require the ES6 shorthand form for defining object literal methods and properties.
    //   let foo = {a() {}};  not  let foo = {a: function() {}};
    'object-shorthand': 'error',

    // For multi-line statements, place line breaks after operators, except place
    // them before "?" and ":", e.g.:
    //   let foo = bar +
    //     baz;
    //   let foo = bar
    //     ? baz
    //     : qux;
    // Conflicts with prettier and switched off in prettier config layer
    // 'operator-linebreak': 'error',

    // suggest using arrow functions as callbacks
    // Conflicts with prettier and switched off in prettier config layer
    /*'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: false,
        allowUnboundThis: true
      }
    ],*/

    // suggest using of const declaration for variables that are never modified after declared
    'prefer-const': [
      'error',
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: true
      }
    ],

    // Prefer destructuring from arrays and objects
    // https://eslint.org/docs/rules/prefer-destructuring
    /**
     * ```
     * // bad
     *  function getFullName(user) {
     *   const firstName = user.firstName;
     *   const lastName = user.lastName;
     *
     *   return `${firstName} ${lastName}`;
     * }
     *
     *  // good
     *  function getFullName(user) {
     *   const { firstName, lastName } = user;
     *   return `${firstName} ${lastName}`;
     * }
     *
     *  // better...
     *  function getFullName({ firstName, lastName }) {
     *   return `${firstName} ${lastName}`;
     * }
     *
     *  const arr = [1, 2, 3, 4];
     *
     *  // bad
     *  const first = arr[0];
     *  const second = arr[1];
     *
     *  // good
     *  const [first, second] = arr;
     ```
     */
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true
        },
        AssignmentExpression: {
          array: true,
          object: false
        }
      },
      {
        enforceForRenamedProperties: false
      }
    ],

    // disallow parseInt() in favor of binary, octal, and hexadecimal literals
    // https://eslint.org/docs/rules/prefer-numeric-literals
    'prefer-numeric-literals': 'error',

    // use rest parameters instead of arguments
    // https://eslint.org/docs/rules/prefer-rest-params
    'prefer-rest-params': 'error',

    // suggest using the spread operator instead of .apply()
    // https://eslint.org/docs/rules/prefer-spread
    'prefer-spread': 'error',

    // suggest using template literals instead of string concatenation
    // https://eslint.org/docs/rules/prefer-template
    'prefer-template': 'error',

    // require a Symbol description
    // https://eslint.org/docs/rules/symbol-description
    'symbol-description': 'error',

    // Require single quotes for string literals unless the value contains a single quote.
    // Conflicts with prettier and switched off in prettier config layer
    // quotes: ['error', 'single', 'avoid-escape'],

    // Disallow generator functions that do not have a yield expression.
    // eslint:recommended 'require-yield': 'error',

    // Require a semicolon at the end of a statement, even though it's optional.
    // Conflicts with prettier and switched off in prettier config layer
    // semi: 'error',

    // Require imports to be sorted (https://eslint.org/docs/rules/sort-imports)
    // 'sort-imports': 'error', will be replaced by eslint-plugin-imports related rules

    /**
     * core js Style.js - some or all of below rules might be switched off by prettier config layering.
     * https://github.com/prettier/eslint-config-prettier/blob/master/index.js
     */
    // Require variables in the same block to be declared alphabetically.
    // 'sort-vars': 'error', ES6 no-var

    // Require space before braces that open blocks.
    //   if (a) {  not  if (a){
    /*'space-before-blocks': 'error',

    // When declaring a function, require a space after the function name.
    //   function foo ()  not  function foo()
    // Conflicts with prettier and switched off in prettier config layer
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],

    // Disallow spaces directly inside parentheses.
    //   (foo, bar)  not  ( foo, bar )
    // Conflicts with prettier and switched off in prettier config layer
    // 'space-in-parens': 'error',

    // Require spacing around infix operators.
    //   a + b  not  a+b
    // Conflicts with prettier and switched off in prettier config layer
    // 'space-infix-ops': 'error',

    // Require space after a keyword unary operator and no space between a non-word
    // unary operator and its operand, e.g.: delete foo.bar; ++baz;
    // Conflicts with prettier and switched off in prettier config layer
    // 'space-unary-ops': 'error',

    // Disallow spaces directly inside of braces in expressions in template strings.
    //   `Hi ${name}`  not  `Hi ${ name }`
    // Conflicts with prettier and switched off in prettier config layer
    // 'template-curly-spacing': 'error',

    // Require no space before and space after the "*" in a yield expression.
    //    yield* x;  not  yield *x;
    // Conflicts with prettier and switched off in prettier config layer
    // 'yield-star-spacing': 'error',

    // Disallow spaces directly inside of brackets.
    //   [1, 2]  not  [ 1, 2 ]
    // Conflicts with prettier and switched off in prettier config layer
    // 'array-bracket-spacing': ['error', 'never'],

    // Require space surrounding an arrow function’s arrow.
    //   (a) => {};  not  (a)=>{};
    // Conflicts with prettier and switched off in prettier config layer
    // 'arrow-spacing': 'error',

    // Require space directly inside opening/closing braces in single-line blocks.
    //   { return true; }  not  {return true;}
    // Conflicts with prettier and switched off in prettier config layer
    // 'block-spacing': 'error',

    // Require the following brace style for control statements and their bodies:
    //   if (foo) {
    //     bar();
    //   }
    //   else {
    //     baz();
    //   }
    // Conflicts with prettier and switched off in prettier config layer
    // 'brace-style': ['error', '1tbs'],

    // Disallow spaces before commas, and require spaces after commas.
    //   (foo, bar, baz)  not  (foo ,bar,baz)
    // Conflicts with prettier and switched off in prettier config layer
    // 'comma-spacing': 'error',

    // Disallow spaces inside computed property brackets
    //   obj[foo]  not  obj[ foo ]
    // Conflicts with prettier and switched off in prettier config layer
    // 'computed-property-spacing': ['error', 'never'],

    // Require files to end with a newline.
    // Conflicts with prettier and switched off in prettier config layer
    // 'eol-last': 'error',

    // For object literal properties, require the format "key: value", i.e., no
    // space before the colon, and one space after the colon.
    // Conflicts with prettier and switched off in prettier config layer
    // 'key-spacing': 'error',

    // Require space around keywords.
    //   if (foo)  not  if(foo)
    // Conflicts with prettier and switched off in prettier config layer
    // 'keyword-spacing': 'error',

    // Require parentheses when invoking a constructor with no arguments.
    // Conflicts with prettier and switched off in prettier config layer
    // 'new-parens': 'error',*/

    // Require constructor names to begin with a capital letter.
    'new-cap': 'error',

    // Disallow use of Array constructor unless creating a sparse array of a given size.
    'no-array-constructor': 'error',

    // Require an empty line before a return statement, except when the return
    // is alone inside a statement block.
    'newline-before-return': 'error',

    // rules added as part of v5 > v6 upgrade
    'require-atomic-updates': 'off',

    /**
     * Import plugin specific recommended rules.
     * TODO: Might be better not to pick recommended config in first place?
     * https://github.com/benmosher/eslint-plugin-import/blob/master/config/recommended.js
     *
     * // analysis/correctness
     * 'import/no-unresolved': 'error', // custom config to disallow amd modules
     * 'import/named': 'error',
     * 'import/namespace': 'error', // we dont need this rule
     * 'import/default': 'error', // we dont need this rule
     * 'import/export': 'error',
     *
     * // red flags (thus, warnings)
     * 'import/no-named-as-default': 'warn', // Override to error in config
     * 'import/no-named-as-default-member': 'warn', // Override to error in config
     * 'import/no-duplicates': 'warn', // Override to error in config
     */
    // ensure imports point to files/modules that can be resolved
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
    'import/no-unresolved': ['error', {commonjs: true, amd: false, caseSensitive: true}],

    // Verifies that all named imports are part of the set of named exports in the referenced module.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/named.md#when-not-to-use-it
    // eslint:import:recommended 'import/named': 'error',

    // disallow invalid exports, e.g. multiple defaults
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/export.md
    // eslint:import:recommended 'import/export': 'error',

    // Enforce a convention of not using namespace (a.k.a. "wildcard" *) imports.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-namespace.md
    // disabled since we need this... recommended setting throws error
    'import/namespace': 'off',

    // do not allow a default import name to match a named export
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
    'import/no-named-as-default': 'error',

    // warn on accessing default export property names that are also named exports
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
    'import/no-named-as-default-member': 'error',

    // TODO: [2019-11-10](ragkiran) Needs more work... around configuration for mono repo? will it be a mono repo for Marcus?
    // TODO: might need this too for alias and monorepo support. https://github.com/laysent/eslint-import-resolver-custom-alias
    // https://github.com/laysent/eslint-import-resolver-custom-alias
    // most of the packages have missing dependencies on internal modules and seem to use modules instead of relative paths
    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    // paths are treated both as absolute paths, and relative to process.cwd()
    'import/no-extraneous-dependencies': [
      'off',
      {
        packageDir: [
          './packages/apps/cloudlake/',
          './packages/apps/blank-store/',
          './packages/apps/react-app-extensions/',
          './packages/apps/react-app-test/',
          './packages/core/app/react-app/',
          './packages/core/common/utils/',
          './packages/core/data/data/',
          './packages/core/store/store/',
          './packages/core/ui/react-ui/',
          './packages/core/ui/resources/',
          './packages/core/ui/styles/',
          './packages/core/wapi/wapi/',
          './packages/plugins/actions/actions/',
          './packages/plugins/components/react-components/',
          './packages/plugins/components/react-widgets/',
          './packages/plugins/endpoints/endpoints/',
          './packages/plugins/initializers/initializers/',
          './packages/plugins/subscribers/subscribers/',
          './packages/tests/api/',
          './packages/tools/babel-config/',
          './packages/tools/cli/',
          './packages/tools/cli-init/',
          './packages/tools/cli-shared/',
          './packages/tools/client/',
          './packages/tools/deployment-controller/',
          './packages/tools/dev/',
          './packages/tools/eslint-config/',
          './packages/tools/i18n/',
          './packages/tools/logger/',
          './packages/tools/metadata/',
          './packages/tools/rollup-config/',
          './packages/tools/stylelint-config/',
          './packages/tools/test/',
          './'
        ],
        devDependencies: [
          'test/**', // common test pattern
          'test/unit/**', // cfw workspace unit tests pattern
          'tests/**', // also common npm pattern
          'spec/**', // mocha, jest-like pattern
          '**/__tests__/**', // jest pattern
          '**/__mocks__/**', // jest pattern
          'test.{js,jsx}', // repos with a single test file
          'test-*.{js,jsx}', // repos with multiple top-level test files
          '**/*{.,_}{test,spec}.{js,jsx}', // tests where the extension or filename suffix denotes that it is a test
          '**/jest.config.*.js', // jest config
          '**/jest.setup.js', // jest setup
          '**/rollup.config.js', // rollup config
          '**/rollup.config.*.js' // rollup config
        ],
        optionalDependencies: true
      }
    ],

    // Forbid mutable exports
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-mutable-exports.md
    // Why? Mutation should be avoided in general, but in particular when exporting mutable bindings.
    // While this technique may be needed for some special cases, in general, only constant references should be exported.
    'import/no-mutable-exports': 'error',

    // Module systems:
    // disallow AMD require/define
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-amd.md
    'import/no-amd': 'error',

    // Style guide:

    // disallow non-import statements appearing before import statements
    // why? since imports are hoisted, keeping them all on top prevents surprising behavior.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md
    'import/first': 'error',

    // disallow duplicate imports
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
    'import/no-duplicates': 'error',

    // Ensure consistent use of file extension within the import path
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        json: 'never'
      }
    ],

    // ensure absolute imports are above relative imports and that unassigned imports are ignored
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
    // TODO: [2019-11-10](ragkiran) enforce a stricter convention in module import order?
    'import/order': ['error', {groups: [['builtin', 'external', 'internal']]}],

    // Require a newline after the last import/require in a group
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md
    'import/newline-after-import': 'error',

    // TODO: [2019-11-10](ragkiran) We seem to depend a lot on default exports, switch off for us and marucs?
    // Require modules with a single export to use a default export
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    'import/prefer-default-export': 'off',

    // Forbid import of modules using absolute paths
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-absolute-path.md
    'import/no-absolute-path': 'error',

    // TODO: [2019-11-10](ragkiran) We seem to depend a lot on Dynamic Require, what should be behavior for Marcus
    // Forbid require() calls with expressions
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
    'import/no-dynamic-require': 'off',

    // Forbid Webpack loader syntax in imports
    // Why? we don't use webpack... and coupling code to a bundler is not a right idea.
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
    'import/no-webpack-loader-syntax': 'error',

    // Prevent importing the default as if it were named export
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-default.md
    'import/no-named-default': 'error',

    // Forbid a module from importing itself
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-self-import.md
    'import/no-self-import': 'error',

    // Forbid cyclical dependencies between modules
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-cycle.md
    'import/no-cycle': ['error', {maxDepth: Infinity}],

    // Ensures that there are no useless path segments
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-useless-path-segments.md
    'import/no-useless-path-segments': 'error',

    /**
     * React specific rules.
     * Recommended config here - https://github.com/yannickcr/eslint-plugin-react/blob/master/index.js
     * 'react/display-name': 'error',
     * 'react/jsx-key': 'error', // Validate JSX has key prop when in array or iterator
     * 'react/jsx-no-comment-textnodes': 'error', // Prevent comments from being inserted as text nodes
     * 'react/jsx-no-duplicate-props': 'error', // Prevent duplicate props in JSX
     * 'react/jsx-no-target-blank': 'error', // Prevent usage of unsafe target='_blank'
     * 'react/jsx-no-undef': 'error', // Disallow undeclared variables in JSX
     * 'react/jsx-uses-react': 'error', // Prevent React to be incorrectly marked as unused
     * 'react/jsx-uses-vars': 'error', // Prevent variables used in JSX to be incorrectly marked as unused
     * 'react/no-children-prop': 'error', // Prevent passing children as props
     * 'react/no-danger-with-children': 'error', // Prevent problem with children and props.dangerouslySetInnerHTML
     * 'react/no-deprecated': 'error', // Prevent usage of deprecated methods, including component lifecycle methods
     * 'react/no-direct-mutation-state': 'error', // Prevent direct mutation of this.state
     * 'react/no-find-dom-node': 'error', // Prevent usage of findDOMNode
     * 'react/no-is-mounted': 'error', // Prevent usage of isMounted
     * 'react/no-render-return-value': 'error', // Prevent usage of the return value of React.render
     * 'react/no-string-refs': 'error', // Prevent using string references in ref attribute.
     * 'react/no-unescaped-entities': 'error', // Prevent invalid characters from appearing in markup
     * 'react/no-unknown-property': 'error', // Prevent usage of unknown DOM property (fixable)
     * 'react/no-unsafe': 'off', // Prevent usage of unsafe lifecycle methods
     * 'react/prop-types': 'error', // Prevent missing props validation in a React component definition
     * 'react/react-in-jsx-scope': 'error', // Prevent missing React when using JSX
     * 'react/require-render-return': 'error' // Enforce ES5 or ES6 class for returning value in render function
     *
     */

    /**
     * Good practices and guard rails type of rules
     */
    // Specify whether double or single quotes should be used in JSX attributes
    // Why? similar to what is in typical HTML tags
    // https://eslint.org/docs/rules/jsx-quotes
    // Conflicts with prettier and switched off in prettier config layer
    // 'jsx-quotes': ['error', 'prefer-double'],

    // exempt react life cycle and related methods from mandating to use `this.` rule.
    'class-methods-use-this': [
      'off',
      {
        exceptMethods: [
          'render',
          'getInitialState',
          'getDefaultProps',
          'getChildContext',
          'componentWillMount',
          'UNSAFE_componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'UNSAFE_componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'UNSAFE_componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount',
          'componentDidCatch',
          'getSnapshotBeforeUpdate'
        ]
      }
    ],

    // Forbid certain propTypes (any, array, object)
    // TODO: [2019-11-10](ragkiran) do we need this or forbid any specific props being passed to component?
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
    'react/forbid-prop-types': [
      'error',
      {
        forbid: ['any', 'array', 'object'],
        checkContextTypes: true,
        checkChildContextTypes: true
      }
    ],

    // Prevent usage of .bind() in JSX props
    // Why? https://github.com/airbnb/javascript/tree/master/react#methods
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
    'react/jsx-no-bind': [
      'error',
      {
        ignoreRefs: true,
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false,
        ignoreDOMComponents: true
      }
    ],

    // Prevent duplicate props in JSX, extended recommended config to ignoreCase
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
    'react/jsx-no-duplicate-props': ['error', {ignoreCase: true}],

    // Disallow undeclared variables in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
    // eslint:react:recommended 'react/jsx-no-undef': 'error',

    // Prevent React to be incorrectly marked as unused
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
    // eslint:react:recommended 'react/jsx-uses-react': ['error'],

    // Prevent variables used in JSX to be incorrectly marked as unused
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
    // eslint:react:recommended 'react/jsx-uses-vars': 'error',

    // Prevent usage of dangerous JSX properties
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
    'react/no-danger': 'error',

    // Prevent usage of deprecated methods
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
    // eslint:react:recommended 'react/no-deprecated': ['error'],

    // Prevent usage of setState in componentDidUpdate
    // Why? Updating the state after a component update will trigger a second render() and can lead to property/layout thrashing.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
    'react/no-did-update-set-state': 'error',

    // Prevent usage of setState in componentWillUpdate
    // Why? Updating the state after a component update will trigger a second render() and can lead to property/layout thrashing.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-will-update-set-state.md
    'react/no-will-update-set-state': 'error',

    // Prevent usage of isMounted
    // Why? Anti pattern and is officially about to be deprecated.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
    //eslint:react:recommended 'react/no-is-mounted': 'error',

    /**
     * ```
     * // bad
     * <Foo
     *   ref="myRef"
     * />
     * // good
     * <Foo
     *   ref={(ref) => { this.myRef = ref; }}
     * />
     */
    // Prevent using string references instead use ref callbacks
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
    // eslint:react:recommended 'react/no-string-refs': 'error',

    /**
     * // bad
     * const Hello = <div class="hello">Hello World</div>;
     *
     * // good
     * const Hello = <div className="hello">Hello World</div>;
     */
    // Prevent usage of unknown DOM property
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
    // eslint:react:recommended 'react/no-unknown-property': 'error',

    /**
     * ```// bad
     * const Hello = createReactClass({
     *   render: function() {
     *     return <div>Hello {this.props.name}</div>;
     *   }
     * });
     *
     * // good
     * class Hello extends React.Component {
     *   render() {
     *     return <div>Hello {this.props.name}</div>;
     *   }
     * }
     * ```
     */
    // Require ES6 class declarations over React.createClass
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md
    'react/prefer-es6-class': ['error', 'always'],

    /**
     * ```
     * // bad
     * class Listing extends React.Component {
     *   render() {
     *     return <div>{this.props.hello}</div>;
     *   }
     * }
     *
     * // bad (relying on function name inference is discouraged)
     * const Listing = ({ hello }) => (
     *   <div>{hello}</div>
     * );
     *
     * // good
     * function Listing({ hello }) {
     *   return <div>{hello}</div>;
     * }```
     */
    // Require stateless functions when not using lifecycle methods, setState or ref
    // Why? if you don’t have state or refs, prefer normal functions (not arrow functions) over classes:
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': ['error', {ignorePureComponents: true}],

    // TODO:  [2019-11-10](ragkiran,ssmyth,rramasam) discuss this, we dont really seem to use propTypes... Can Marcus use propTypes?
    // Prevent missing props validation in a React component definition
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
    'react/prop-types': [
      'error',
      {
        ignore: [],
        customValidators: [],
        skipUndeclared: false
      }
    ],

    // Prevent missing React when using JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
    // eslint:react:recommended 'react/react-in-jsx-scope': 'error',

    // Require render() methods to return something
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
    // eslint:react:recommended 'react/require-render-return': 'error',

    /**
     * ```
     * // bad
     * render() {
     *   return <MyComponent variant="long body" foo="bar">
     *            <MyChild />
     *          </MyComponent>;
     * }
     * // good
     * render() {
     *   return (
     *     <MyComponent variant="long body" foo="bar">
     *       <MyChild />
     *     </MyComponent>
     *   );
     * }
     * // good, when single line
     * render() {
     *   const body = <div>hello</div>;
     *   return <MyComponent>{body}</MyComponent>;
     * }
     * ```
     */
    // Prevent missing parentheses around multi lines JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-wrap-multilines.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    /*'react/jsx-wrap-multilines': [
      'error',
      {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line'
      }
    ],*/

    /**
     * ```
     * //  bad
     * const Hello = <a target='_blank' href={dynamicLink}></a>
     * // good - has to be accompanied by `noopener noreferrer`
     * const Hello = <a target="_blank" rel="noopener noreferrer" href="http://example.com"></a>
     */
    // Disallow target="_blank" on links
    // extended recommended config to include enforceDynamicLinks
    // https://github.com/yannickcr/eslint-plugin-react/blob/ac102885765be5ff37847a871f239c6703e1c7cc/docs/rules/jsx-no-target-blank.md
    'react/jsx-no-target-blank': ['error', {enforceDynamicLinks: 'always'}],

    /**
     * TODO: [2020-01-10](ragkiran,ssmyth,rramasam) Issues with rollup build when this rule is used, enable in future.
     * why? intuitive and makes sense since jsx is still not an official standard
     */
    // only .jsx files may have JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': ['off', {extensions: ['.jsx']}],

    // TODO: [2019-11-10](ragkiran,ssmyth,rramasam) discuss this, we seem to be using this. Should we do this and can marcus do this too?
    // disallow using React.render/ReactDOM.render's return value
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md
    'react/no-render-return-value': 'error',

    // warn against using findDOMNode()
    // Why? Facebook will eventually deprecate findDOMNode as it blocks certain improvements in React in the future.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
    //eslint:react:recommended 'react/no-find-dom-node': 'error',

    /**
     * ```
     * // bad
     * <div dangerouslySetInnerHTML={{ __html: "HTML" }}>
     *   Children
     * </div>
     *
     * <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
     *   Children
     * </Hello>
     * // good
     * <div dangerouslySetInnerHTML={{ __html: "HTML" }} />
     *
     * <Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />
     * ```
     */
    // Prevent problem with children and props.dangerouslySetInnerHTML
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md
    // eslint:react:recommended 'react/no-danger-with-children': 'error',

    // TODO:  [2019-11-10](ragkiran,ssmyth,rramasam) discuss this, we dont really seem to use propTypes. Can Marcus use propTypes?
    // Prevent unused propType definitions
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
    'react/no-unused-prop-types': [
      'error',
      {
        customValidators: [],
        skipShapeProps: true
      }
    ],

    // Prevent invalid characters from appearing in markup
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
    // eslint:react:recommended 'react/no-unescaped-entities': 'error',

    // Prevent passing of children as props
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md
    // eslint:react:recommended 'react/no-children-prop': 'error',

    // Validate whitespace in and around the JSX opening and closing brackets
    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-tag-spacing.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    /*'react/jsx-tag-spacing': [
      'error',
      {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never'
      }
    ],*/

    // Prevent usage of Array index in keys
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
    'react/no-array-index-key': 'error',

    // TODO:  [2019-11-10](ragkiran,ssmyth,rramasam) discuss this, we dont really seem to use propTypes. Can Marcus use propTypes?
    // Enforce a defaultProps definition for every prop that is not a required prop
    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/require-default-props.md
    'react/require-default-props': [
      'error',
      {
        forbidDefaultForRequired: true
      }
    ],

    // TODO:  [2019-11-10](ragkiran,ssmyth,rramasam) discuss this, we dont really seem to use propTypes... Can Marcus use propTypes?
    // Forbids using non-exported propTypes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-foreign-prop-types.md
    // this is intentionally set to "warn". it would be "error",
    // but it's only critical if you're stripping propTypes in production.
    'react/forbid-foreign-prop-types': ['error', {allowInPropTypes: true}],

    // Prevent void DOM elements (e.g. <img />, <br />) from receiving children
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md
    'react/void-dom-elements-no-children': 'error',

    // TODO:  [2019-11-10](ragkiran,ssmyth,rramasam) discuss this, we dont really seem to use propTypes. Can Marcus use propTypes?
    // Enforce all defaultProps have a corresponding non-required PropType
    // https://github.com/yannickcr/eslint-plugin-react/blob/9e13ae2c51e44872b45cc15bf1ac3a72105bdd0e/docs/rules/default-props-match-prop-types.md
    'react/default-props-match-prop-types': ['error', {allowRequiredDefaults: false}],

    // Prevent usage of shouldComponentUpdate when extending React.PureComponent
    // What/Why? While having shouldComponentUpdate will still work, it becomes pointless to extend PureComponent.
    // https://github.com/yannickcr/eslint-plugin-react/blob/9e13ae2c51e44872b45cc15bf1ac3a72105bdd0e/docs/rules/no-redundant-should-component-update.md
    'react/no-redundant-should-component-update': 'error',

    // Prevent unused state values that are defined and never used.
    // https://github.com/yannickcr/eslint-plugin-react/pull/1103/
    'react/no-unused-state': 'error',

    // Prevents common casing typos declaring static class properties and lifecycle methods.
    // https://github.com/yannickcr/eslint-plugin-react/blob/73abadb697034b5ccb514d79fb4689836fe61f91/docs/rules/no-typos.md
    'react/no-typos': 'error',

    // Prevent using this.state within a this.setState
    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/no-access-state-in-setstate.md
    'react/no-access-state-in-setstate': 'error',

    // Prevent usage of button elements without an explicit type attribute
    // Why? The default value of type attribute for button HTML element is "submit"
    // which is often not the desired behavior and may lead to unexpected page reloads.
    // https://www.nngroup.com/articles/reset-and-cancel-buttons/
    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/button-has-type.md
    'react/button-has-type': [
      'error',
      {
        button: true,
        submit: true,
        reset: false
      }
    ],

    // Prevent this from being used in stateless functional components
    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/no-this-in-sfc.md
    'react/no-this-in-sfc': 'error',

    // TODO: [2019-11-10](ragkiran,ssmyth,rramasam) discuss this, no component states... Can Marcus still use this?
    // Enforce state initialization style
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/state-in-constructor.md
    'react/state-in-constructor': ['error', 'always'],

    // Enforces where React component static properties should be positioned
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/static-property-placement.md
    'react/static-property-placement': [
      'error',
      'property assignment',
      {
        contextType: 'static public field',
        displayName: 'static public field'
      }
    ],

    // TODO: [2019-11-10](ragkiran,ssmyth,rramasam) ~24 violations, do we need to discuss, is this applicable to Marcus as well
    // This can be false positive for HOC and good practice for components to explicitly calling out the props its consuming
    // Disallow JSX props spreading
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
    'react/jsx-props-no-spreading': [
      'off',
      {
        html: 'enforce',
        custom: 'enforce',
        exceptions: []
      }
    ],

    /**
     * React hooks specific rules...
     */
    // show error if hook rules not met
    'react-hooks/rules-of-hooks': 'error',

    // warn if the list of dependencies for Hooks like useEffect not verified
    'react-hooks/exhaustive-deps': 'error',

    /**
     * JSX Specific styles and conventions react-jsx-styles
     * TODO: If we plan on switching using prettier, if below rules conflict the ones provided here, we should switch those off
     * https://github.com/prettier/eslint-config-prettier/blob/master/react.js
     */
    /**
     * ```
     * // bad
     * <Foo
     *   hidden={true}
     * />
     * // good
     * <Foo
     *   hidden
     * />
     * <Foo hidden />```
     */
    // Enforce boolean attributes notation in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
    // 'react/jsx-boolean-value': ['error', 'never', {always: []}],

    /**
     * ```
     * // bad
     * <Foo
     *   bar="bar"
     *   baz="baz" />
     * // good
     * <Foo
     *   bar="bar"
     *   baz="baz"
     * />```
     */
    // Validate closing bracket location in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    // 'react/jsx-closing-bracket-location': ['error', 'line-aligned'],

    /**
     * ```// bad
     * <Foo superLongParam="bar"
     *    anotherSuperLongParam="baz" />
     *
     * // good
     * <Foo
     *   superLongParam="bar"
     *   anotherSuperLongParam="baz"
     * />
     *
     * // if props fit in one line then keep it on the same line
     * <Foo bar="bar" />
     *
     * // children get indented normally
     * <Foo
     *   superLongParam="bar"
     *   anotherSuperLongParam="baz"
     * >
     *   <Quux />
     * </Foo>
     *
     * // bad
     * {showButton &&
     *   <Button />
     * }
     *
     * // bad
     * {
     *   showButton &&
     *   <Button />
     * }
     *
     * // good
     * {showButton && (
     *   <Button />
     * )}
     *
     * // good
     * {showButton && <Button />}```
     */
    // Validate closing tag location in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    // 'react/jsx-closing-tag-location': 'error',

    /**
     * ```
     * // bad
     * <Foo bar={ baz } />
     *
     * // good
     * <Foo bar={baz} />```
     */
    // Enforce or disallow spaces inside of curly braces in JSX attributes
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    // 'react/jsx-curly-spacing': ['error', 'never', {allowMultiline: true}],

    // Validate props indentation in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    // 'react/jsx-indent-props': ['error', 2],

    // Limit maximum of props on a single line in JSX
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    // 'react/jsx-max-props-per-line': ['error', {maximum: 1, when: 'multiline'}],

    // Enforce PascalCase for user-defined JSX components
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
    'react/jsx-pascal-case': [
      'error',
      {
        allowAllCaps: true,
        ignore: []
      }
    ],

    /**
     * ```
     * // bad
     * const HelloJohn = <Hello name="John"></Hello>;
     * // good
     * const HelloJohn = <Hello name="John" />;
     * ```
     */
    // Prevent extra closing tags for components without children
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
    // 'react/self-closing-comp': 'error',

    // Enforce component methods order
    // why? cleaner when there are multiple imports.
    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/sort-comp.md
    /*'react/sort-comp': [
      'error',
      {
        order: [
          'static-methods',
          'instance-variables',
          'lifecycle',
          '/^on.+$/',
          'getters',
          'setters',
          '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
          'instance-methods',
          'everything-else',
          'rendering'
        ],
        groups: {
          lifecycle: [
            'displayName',
            'propTypes',
            'contextTypes',
            'childContextTypes',
            'mixins',
            'statics',
            'defaultProps',
            'constructor',
            'getDefaultProps',
            'getInitialState',
            'state',
            'getChildContext',
            'getDerivedStateFromProps',
            'componentWillMount',
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
            'getSnapshotBeforeUpdate',
            'componentDidUpdate',
            'componentDidCatch',
            'componentWillUnmount',
            'componentDidCatch'
          ],
          rendering: ['/^render.+$/', 'render']
        }
      }
    ],*/

    /**
     * ```
     * // bad
     * <Hello foo={{
     *    }}
     *    bar />
     *
     * // good
     * <Hello foo={{
     * }} />
     *
     * <Hello
     *     foo={{
     *     }}
     *     bar
     * />
     */

    // Require that the first prop in a JSX element be on a new line when the element is multiline
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    // 'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],

    // Enforce spacing around jsx equals signs
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    // 'react/jsx-equals-spacing': ['error', 'never'],

    // Enforce JSX indentation
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    // 'react/jsx-indent': ['error', 2],

    /**
     * ```
     * // bad
     * <div style="color: 'red'" />
     * <Hello style={true} />
     * React.createElement("div", { style: "color: 'red'" });
     *
     * // good
     * <div style={{ color: "red" }} />
     * <Hello style={{ color: "red" }} />
     * React.createElement("div", { style: { color: 'red' }});
     */
    // Require style prop value be an object or var
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
    // 'react/style-prop-object': 'error',

    // Enforce curly braces or disallow unnecessary curly braces in JSX props and/or children
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
    // 'react/jsx-curly-brace-presence': ['error', {props: 'never', children: 'never'}],

    // One JSX Element Per Line
    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/jsx-one-expression-per-line.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    // 'react/jsx-one-expression-per-line': ['error', {allow: 'single-child'}],

    // Enforce consistent usage of destructuring assignment of props, state, and context
    // TODO: Can enable in future, looks more like a coding style choice can be debatable
    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/destructuring-assignment.md
    'react/destructuring-assignment': ['off', 'always'],

    // Disallow multiple spaces between inline JSX props
    // https://github.com/yannickcr/eslint-plugin-react/blob/ac102885765be5ff37847a871f239c6703e1c7cc/docs/rules/jsx-props-no-multi-spaces.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    // 'react/jsx-props-no-multi-spaces': 'error',

    /**
     * ```
     * // bad
     * <React.Fragment><Foo /></React.Fragment>
     *
     * // good
     * <><Foo /></>
     * <React.Fragment key="key"><Foo /></React.Fragment>
     */
    // Enforce shorthand or standard form for React fragments
    // https://github.com/yannickcr/eslint-plugin-react/blob/bc976b837abeab1dffd90ac6168b746a83fc83cc/docs/rules/jsx-fragments.md
    // 'react/jsx-fragments': ['error', 'syntax'],

    // Enforce line breaks in curly braces in JSX attributes and expressions.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-newline.md
    // Conflicts with prettier/react and switched off in prettier/react config layer
    /*'react/jsx-curly-newline': [
      'error',
      {
        multiline: 'consistent',
        singleline: 'consistent'
      }
    ],*/

    /**
     * jsx-a11y specific recommended config ... Applicable for reference apps, OOTB components and Marcus?
     * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/src/index.js
     *
     * 'jsx-a11y/accessible-emoji': 'error',
     * 'jsx-a11y/alt-text': 'error',
     * 'jsx-a11y/anchor-has-content': 'error',
     * 'jsx-a11y/anchor-is-valid': 'error',
     * 'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
     * 'jsx-a11y/aria-props': 'error',
     * 'jsx-a11y/aria-proptypes': 'error',
     * 'jsx-a11y/aria-role': 'error',require-atomic-updates
     * 'jsx-a11y/aria-unsupported-elements': 'error',
     * 'jsx-a11y/autocomplete-valid': 'error', // Need to add wrapper components for inputs??
     * 'jsx-a11y/click-events-have-key-events': 'error',
     * 'jsx-a11y/control-has-associated-label': ['off',
     *   {
     *     ignoreElements: [
     *       'audio',
     *       'canvas',
     *       'embed',
     *       'input',
     *       'textarea',
     *       'tr',
     *       'video',
     *     ],
     *     ignoreRoles: [
     *       'grid',
     *       'listbox',
     *       'menu',
     *       'menubar',
     *       'radiogroup',
     *       'row',
     *       'tablist',
     *       'toolbar',
     *       'tree',
     *       'treegrid',
     *     ],
     *     includeRoles: [
     *       'alert',
     *       'dialog',
     *     ],
     *   },
     * ],
     * 'jsx-a11y/heading-has-content': 'error',
     * 'jsx-a11y/html-has-lang': 'error',
     * 'jsx-a11y/iframe-has-title': 'error',
     * 'jsx-a11y/img-redundant-alt': 'error',
     * 'jsx-a11y/interactive-supports-focus': [
     *   'error',
     *   {
     *     tabbable: [
     *       'button',
     *       'checkbox',
     *       'link',
     *       'searchbox',
     *       'spinbutton',
     *       'switch',
     *       'textbox',
     *     ],
     *   },
     * ],
     * 'jsx-a11y/label-has-associated-control': 'error',
     * 'jsx-a11y/label-has-for': 'off',
     * 'jsx-a11y/media-has-caption': 'error',
     * 'jsx-a11y/mouse-events-have-key-events': 'error',
     * 'jsx-a11y/no-access-key': 'error',
     * 'jsx-a11y/no-autofocus': 'error',
     * 'jsx-a11y/no-distracting-elements': 'error',
     * 'jsx-a11y/no-interactive-element-to-noninteractive-role': [
     *   'error',
     *   {
     *     tr: ['none', 'presentation'],
     *   },
     * ],
     * 'jsx-a11y/no-noninteractive-element-interactions': [
     *   'error',
     *   {
     *     handlers: [
     *       'onClick',
     *       'onError',
     *       'onLoad',
     *       'onMouseDown',
     *       'onMouseUp',
     *       'onKeyPress',
     *       'onKeyDown',
     *       'onKeyUp',
     *     ],
     *     alert: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
     *     body: ['onError', 'onLoad'],
     *     dialog: ['onKeyUp', 'onKeyDown', 'onKeyPress'],
     *     iframe: ['onError', 'onLoad'],
     *     img: ['onError', 'onLoad'],
     *   },
     * ],
     * 'jsx-a11y/no-noninteractive-element-to-interactive-role': [
     *   'error',
     *   {
     *     ul: [
     *       'listbox',
     *       'menu',
     *       'menubar',
     *       'radiogroup',
     *       'tablist',
     *       'tree',
     *       'treegrid',
     *     ],
     *     ol: [
     *       'listbox',
     *       'menu',
     *       'menubar',
     *       'radiogroup',
     *       'tablist',
     *       'tree',
     *       'treegrid',
     *     ],
     *     li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
     *     table: ['grid'],
     *     td: ['gridcell'],
     *   },
     * ],
     * 'jsx-a11y/no-noninteractive-tabindex': [
     *   'error',
     *   {
     *     tags: [],
     *     roles: ['tabpanel'],
     *     allowExpressionValues: true,
     *   },
     * ],
     * 'jsx-a11y/no-onchange': 'error',
     * 'jsx-a11y/no-redundant-roles': 'error',
     * 'jsx-a11y/no-static-element-interactions': [
     *   'error',
     *   {
     *     allowExpressionValues: true,
     *     handlers: [
     *       'onClick',
     *       'onMouseDown',
     *       'onMouseUp',
     *       'onKeyPress',
     *       'onKeyDown',
     *       'onKeyUp',
     *     ],
     *   },
     * ],
     * 'jsx-a11y/role-has-required-aria-props': 'error',
     * 'jsx-a11y/role-supports-aria-props': 'error',
     * 'jsx-a11y/scope': 'error',
     * 'jsx-a11y/tabindex-no-positive': 'error',
     */
    // TODO: Add a relevant Anchor Component if we have one?
    // Enforce that anchors have content
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-has-content.md
    // https://dequeuniversity.com/rules/axe/3.2/link-name
    'jsx-a11y/anchor-has-content': ['error', {components: ['Anchor']}],

    /**
     * <div role="datepicker"></div> <!-- Bad: "datepicker" is not an ARIA role -->
     * <div role="range"></div>      <!-- Bad: "range" is an _abstract_ ARIA role -->
     *
     * <div role="button"></div>     <!-- Good: "button" is a valid ARIA role -->
     * <div></div>                   <!-- Good: No ARIA role -->
     */
    // Require ARIA roles to be valid and non-abstract
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-role.md
    // https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_01
    'jsx-a11y/aria-role': ['error', {ignoreNonDom: false}],

    /**
     * <!-- Bad: Labeled using incorrectly spelled aria-labeledby -->
     * <div id="address_label">Enter your address</div>
     * <input aria-labeledby="address_label">
     *
     * <!-- Good: Labeled using correctly spelled aria-labelledby -->
     * <div id="address_label">Enter your address</div>
     * <input aria-labelledby="address_label">
     */
    // Enforce all aria-* props are valid.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-props.md
    // jsx:a11y:recommended 'jsx-a11y/aria-props': 'error',

    /**
     * <!-- Bad: the aria-hidden state is of type true/false -->
     * <span aria-hidden="yes">foo</span>
     *
     * <!-- Good: the aria-hidden state is of type true/false -->
     * <span aria-hidden="true">foo</span>
     */
    // Enforce ARIA state and property values are valid.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-proptypes.md
    //jsx:a11y:recommended 'jsx-a11y/aria-proptypes': 'error',

    /**
     * ```
     * <!-- Bad: the meta element should not be given any ARIA attributes -->
     * <meta charset="UTF-8" aria-hidden="false" />
     *
     * <!-- Good: the meta element should not be given any ARIA attributes -->
     * <meta charset="UTF-8" />```
     */
    // Enforce that elements that do not support ARIA roles, states, and
    // properties do not have those attributes.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-unsupported-elements.md
    // jsx:a11y:recommended 'jsx-a11y/aria-unsupported-elements': 'error',

    /**
     * // bad
     * <img src="foo" />
     * <img {...props} />
     * <img {...props} alt /> // Has no value
     * <img {...props} alt={undefined} /> // Has no value
     * <img {...props} alt={`${undefined}`} /> // Has no value
     * <img src="foo" role="presentation" /> // Avoid ARIA if it can be achieved without
     * <img src="foo" role="none" /> // Avoid ARIA if it can be achieved without
     * <object {...props} />
     * <area {...props} />
     * <input type="image" {...props} />
     *
     * // good
     * <img src="foo" alt="Foo eating a sandwich." />
     * <img src="foo" alt={"Foo eating a sandwich."} />
     * <img src="foo" alt={altText} />
     * <img src="foo" alt={`${person} smiling`} />
     * <img src="foo" alt="" />
     * <object aria-label="foo" />
     * <object aria-labelledby="id1" />
     * <object>Meaningful description</object>
     * <object title="An object" />
     * <area aria-label="foo" />
     * <area aria-labelledby="id1" />
     * <area alt="This is descriptive!" />
     * <input type="image" alt="This is descriptive!" />
     * <input type="image" aria-label="foo" />
     * <input type="image" aria-labelledby="id1" />
     */
    // Enforce that all elements that require alternative text have meaningful information
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/alt-text.md
    // extends recommended config to add specific elements.
    'jsx-a11y/alt-text': [
      'error',
      {
        elements: ['img', 'object', 'area', 'input[type="image"]'],
        img: [],
        object: [],
        area: [],
        'input[type="image"]': []
      }
    ],

    // Prevent img alt text from containing redundant words like "image", "picture", or "photo"
    // Why? Screen readers already announce img elements as an image. No need to use words such as image, photo, and/or picture.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/img-redundant-alt.md
    // jsx:a11y:recommended 'jsx-a11y/img-redundant-alt': 'error',

    // TODO: [2019-10-31](ragkiran,ssmyth,rramasam) Any custom Label componets for a11y?
    // Enforce that a label tag has a text label and an associated control.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: [],
        assert: 'both',
        depth: 25
      }
    ],

    // Overrides recommended config with specific settings
    // Enforce that a control (an interactive element) has a text label.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/control-has-associated-label.md
    'jsx-a11y/control-has-associated-label': [
      'error',
      {
        labelAttributes: ['label'],
        controlComponents: [],
        ignoreElements: ['audio', 'canvas', 'embed', 'input', 'textarea', 'tr', 'video'],
        ignoreRoles: [
          'grid',
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'row',
          'tablist',
          'toolbar',
          'tree',
          'treegrid'
        ],
        depth: 5
      }
    ],

    // require that mouseover/out come with focus/blur, for keyboard-only users
    // why? Coding for the keyboard is important for users with physical disabilities and screen reader based users who cannot use a mouse
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
    // TODO [2019-12-20](ragkiran) Part of recommended config, remove below line once violations are fixed.
    'jsx-a11y/mouse-events-have-key-events': 'error',

    // Prevent use of `accessKey`
    // Why? inconsistencies between keyboard shortcuts and keyboard
    // commands used by screen reader and keyboard only users create accessibility complications
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-access-key.md
    // jsx:a11y:recommended 'jsx-a11y/no-access-key': 'error',

    // switching this off since this is more of a trouble than a guide.
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/398
    'jsx-a11y/no-onchange': 'off',

    /**
     * // bad
     * <!-- Bad: span with onClick attribute has no tabindex -->
     * <span onclick="submitForm();" role="button">Submit</span>
     * <!-- Bad: anchor element without href is not focusable -->
     * <a onclick="showNextPage();" role="button">Next page</a>
     *
     * // good
     * <!-- Good: div with onClick attribute is hidden from screen reader -->
     * <div aria-hidden onClick={() => void 0} />
     * <!-- Good: span with onClick attribute is in the tab order -->
     * <span onClick="doSomething();" tabIndex="0" role="button">Click me!</span>
     * <!-- Good: span with onClick attribute may be focused programmatically -->
     * <span onClick="doSomething();" tabIndex="-1" role="menuitem">Click me too!</span>
     * <!-- Good: anchor element with href is inherently focusable -->
     * <a href="javascript:void(0);" onClick="doSomething();">Click ALL the things!</a>
     * <!-- Good: buttons are inherently focusable -->
     * <button onClick="doSomething();">Click the button :)</button>
     *
     */
    // Elements with an interactive role and interaction handlers must be focusable
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/interactive-supports-focus.md
    // jsx:a11y:recommended 'jsx-a11y/interactive-supports-focus': 'error',

    /**
     * <!-- Bad: the checkbox role requires the aria-checked state -->
     * <span role="checkbox" aria-labelledby="foo" tabindex="0"></span>
     *
     * <!-- Good: the checkbox role requires the aria-checked state -->
     * <span role="checkbox" aria-checked="false" aria-labelledby="foo" tabindex="0"></span>
     */
    // Enforce that elements with ARIA roles must have all required attributes
    // for that role.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-has-required-aria-props.md
    // jsx:a11y:recommended 'jsx-a11y/role-has-required-aria-props': 'error',

    /**
     *```
     * <!-- Bad: the radio role does not support the aria-required property -->
     * <ul role="radiogroup" aria-labelledby="foo">
     *   <li aria-required="true" tabindex="-1" role="radio" aria-checked="false">Rainbow Trout</li>
     *   <li aria-required="true" tabindex="-1" role="radio" aria-checked="false">Brook Trout</li>
     *   <li aria-required="true" tabindex="0" role="radio" aria-checked="true">Lake Trout</li>
     * </ul>
     *
     * <!-- Good: the radiogroup role does support the aria-required property -->
     * <ul role="radiogroup" aria-required="true" aria-labelledby="foo">
     *   <li tabindex="-1" role="radio" aria-checked="false">Rainbow Trout</li>
     *   <li tabindex="-1" role="radio" aria-checked="false">Brook Trout</li>
     *   <li tabindex="0" role="radio" aria-checked="true">Lake Trout</li>
     * </ul>```
     */
    // Enforce that elements with explicit or implicit roles defined contain
    // only aria-* properties supported by that role.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/role-supports-aria-props.md
    // jsx:a11y:recommended 'jsx-a11y/role-supports-aria-props': 'error',

    // Enforce tabIndex value is not greater than zero.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/tabindex-no-positive.md
    // https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_focus_03
    // jsx:a11y:recommended 'jsx-a11y/tabindex-no-positive': 'error',

    // ensure <hX> tags have content and are not aria-hidden
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/heading-has-content.md
    // jsx:a11y:recommended 'jsx-a11y/heading-has-content': 'error',

    // require HTML elements to have a "lang" prop
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/html-has-lang.md
    // jsx:a11y:recommended 'jsx-a11y/html-has-lang': 'error',

    // require HTML element's lang prop to be valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/lang.md
    'jsx-a11y/lang': 'error',

    // prevent distracting elements, like <marquee> and <blink>
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-distracting-elements.md
    'jsx-a11y/no-distracting-elements': [
      'error',
      {
        elements: ['marquee', 'blink']
      }
    ],

    // only allow <th> to have the "scope" attr
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/scope.md
    // jsx:a11y:recommended 'jsx-a11y/scope': 'error',

    // require onClick be accompanied by onKeyUp/onKeyDown/onKeyPress
    // Why? Coding for the keyboard is important for users with physical disabilities who cannot use a mouse
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md
    // TODO [2019-12-20] (ragkiran) remove below line after violations are fixed.
    'jsx-a11y/click-events-have-key-events': 'error',

    // TODO: [2019-10-31](ragkiran,ssmyth,rramasam) Any custom handlers to be added?
    // Enforce that DOM elements without semantic behavior not have interaction handlers
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
    // jsx:a11y:recommended
    // TODO [2019-12-20] (ragkiran) remove below line after violations are fixed.
    'jsx-a11y/no-static-element-interactions': [
      'error',
      {
        handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp']
      }
    ],

    // TODO: [2019-10-31](ragkiran,ssmyth,rramasam) Any custom handlers to be added?
    // A non-interactive element does not support event handlers (mouse and key handlers)
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-interactions.md
    'jsx-a11y/no-noninteractive-element-interactions': [
      'error',
      {
        handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp']
      }
    ],

    // ensure emoji wrapped in <span> and provide screen reader access.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/accessible-emoji.md
    // jsx:a11y:recommended 'jsx-a11y/accessible-emoji': 'error',

    // elements with aria-activedescendant must be tabbable
    // What is this? Search typeahead box example... first / recommended element id should be set as activedescendant.
    // <CustomComponent aria-activedescendant={someID} tabIndex={-1} />
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/aria-activedescendant-has-tabindex.md
    //jsx:a11y:recommended 'jsx-a11y/aria-activedescendant-has-tabindex': 'error',

    // ensure iframe elements have a unique title property to indicate its content to the user.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/iframe-has-title.md
    // jsx:a11y:recommended 'jsx-a11y/iframe-has-title': 'error',

    // prohibit autoFocus prop is not used on elements
    // Why? Auto focusing elements can cause usability issues for sighted and non-sighted users, alike.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-autofocus.md
    'jsx-a11y/no-autofocus': ['error', {ignoreNonDOM: true}],

    // ensure HTML elements do not specify redundant ARIA roles
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-redundant-roles.md
    // jsx:a11y:recommended 'jsx-a11y/no-redundant-roles': 'error',

    // media elements must have captions
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption.md
    'jsx-a11y/media-has-caption': [
      'error',
      {
        audio: [],
        video: [],
        track: []
      }
    ],

    // WAI-ARIA roles should not be used to convert an interactive element to non-interactive
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-interactive-element-to-noninteractive-role.md
    'jsx-a11y/no-interactive-element-to-noninteractive-role': [
      'error',
      {
        tr: ['none', 'presentation']
      }
    ],

    // WAI-ARIA roles should not be used to convert a non-interactive element to interactive
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-to-interactive-role.md
    'jsx-a11y/no-noninteractive-element-to-interactive-role': [
      'error',
      {
        ul: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
        ol: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
        li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
        table: ['grid'],
        td: ['gridcell']
      }
    ],

    // Tab key navigation should be limited to elements on the page that can be interacted with.
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-tabindex.md
    'jsx-a11y/no-noninteractive-tabindex': [
      'error',
      {
        tags: [],
        roles: ['tabpanel']
      }
    ],

    // ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton']
      }
    ],

    /**
     * Unicorn specific rules, filename case and other assorted good practices.
     *
     */
    // Enforce a kebab-case style for filenames
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/filename-case.md
    'unicorn/filename-case': 'error',

    // Enforce the use of new for all builtins, except String, Number and Boolean
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/new-for-builtins.md
    'unicorn/new-for-builtins': 'error',

    // Require Array.isArray() instead of instanceof Array
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-array-instanceof.md
    'unicorn/no-array-instanceof': 'error',

    // Prefer .addEventListener() and .removeEventListener() over on-functions
    // Why? https://stackoverflow.com/questions/6348494/addeventlistener-vs-onclick/35093997#35093997
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-add-event-listener.md
    'unicorn/prefer-add-event-listener': 'error',

    // Prefer KeyboardEvent#key over KeyboardEvent#keyCode which is deprecated
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-event-key.md
    'unicorn/prefer-event-key': 'error',

    // Prefer Node#append() over Node#appendChild()
    // Why? https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/append
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-node-append.md
    'unicorn/prefer-node-append': 'error',

    // Prefer node.remove() over parentNode.removeChild(node) and parentElement.removeChild(node)
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-node-remove.md
    'unicorn/prefer-node-remove': 'error',

    // Prefer .querySelector() over .getElementById(),
    // .querySelectorAll() over .getElementsByClassName() and .getElementsByTagName()
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-query-selector.md
    'unicorn/prefer-query-selector': 'error',

    // Require new when throwing an error, it's better to be explicit.
    // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/throw-new-error.md
    'unicorn/throw-new-error': 'error',

    'prettier/prettier': [
      'error',
      {
        ...prettierConfig
      }
    ]
  },

  // overrides for specific rules and configurations
  overrides: [
    {
      files: [
        '**/__test__/**/*.spec.js?(x)', // unit test pattern
        '**/__test__/**/*.js?(x)', // unit test utils and helpers
        '**/test/unit/**/*.spec.js?(x)', // unit test pattern
        '**/tests/api/**/*.js?(x)', // API test utils, config and helpers
        '**/tests/integration/**/*.js?(x)', // Integration test utils, config and helpers
        '**/perf/+(*)-audits/**/*.js?(x)', // Utils, config, mocks and specs for app tests
        '**/mocks/**/*.js?(x)', // Mocks for API and Integration tests
        '**/__mocks__/**/*.js?(x)', // Mocks for unit tests
        '**/api/**/?(*.)spec.js?(x)', // API tests pattern
        '**/?(*.)test.js?(x)', // unit test pattern
        '**/qa/**/?(*.)data.js' // API test data files pattern
      ],
      env: {
        jest: true,
        node: true
      },
      globals: {
        document: true,
        localStorage: true,
        URL: true,
        window: true
      },
      rules: {
        // explicitly switch off jsx-a11y rules that show up in specs/tests
        'jsx-a11y/anchor-is-valid': 'off',
        'react/display-name': 'off',
        'max-lines': 'off',
        'no-loop-func': 'off',
        'no-restricted-syntax': [
          'error',
          {
            // blocks jest.setTimeout() call in spec files, allows if timeout > 100 seconds for really long tests...
            selector:
              'CallExpression[callee.object.name="jest"][callee.property.name="setTimeout"][arguments.0.value < 100000]',
            message:
              'avoid test specific timeouts, set JEST_TIMEOUT environment variable to desired value or timeout higher than 100 seconds'
          },
          {
            // blocks screen.debug() calls in spec files
            selector: 'MemberExpression[object.name="screen"][property.name="debug"]',
            message: 'Avoid too much console logging with screen.debug() calls'
          },
          {
            // blocks debug() calls in spec files
            selector: 'CallExpression[callee.name="debug"]',
            message: 'Avoid too much console logging with debug() calls'
          }
        ]
      }
    },
    {
      files: [],
      rules: {
        'no-loop-func': 'off'
      }
    },
    {
      /* Throws an error if unreleased component/widgets are referred to in released comps */
      files: [
        'packages/plugins/components/react-components/**/*.js',
        'packages/plugins/components/react-widgets/**/*.js'
      ],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              '@sugar-candy-framework/react-components-unreleased/*',
              '@sugar-candy-framework/react-widgets-unreleased/*'
            ]
          }
        ]
      }
    }
  ]
};
