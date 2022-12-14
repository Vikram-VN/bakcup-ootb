module.exports = {
  plugins: ['@sugar-candy-framework/eslint-plugin-cfw'],
  extends: ['./base/index.js'].map(require.resolve),
  rules: {
    'react/prop-types': 'off', // TODO: cfw's take on this from base config?
    '@sugar-candy-framework/cfw/no-underscore-ootb-exports': 'error',
    '@sugar-candy-framework/cfw/oracle-copyright': 'error',
    'react/forbid-prop-types': 'off', // TODO: Enable forbid-prop-type after proper fixes are in
    'react/display-name': 'off',
    'spellcheck/spell-checker': [
      'warn',
      {
        comments: true,
        strings: false,
        identifiers: false,
        templates: false,
        lang: 'en_US',
        skipWords: [
          'activedescendant',
          'ajax',
          'altnames',
          'args',
          'async',
          'Async',
          'auth',
          'axe',
          'axios',
          'Babel',
          'backend',
          'backorderable',
          'BigInts',
          'bing',
          'bitwise',
          'bool',
          'builtins',
          'bundler',
          'callee',
          'camelcase',
          'Canonicalizes',
          'candyAdmin',
          'ccexpress',
          'candyWeb',
          'candyWebui',
          'charset',
          'checkbox',
          'checksums',
          'cli',
          'cloudlake',
          'cond',
          'conf',
          'configurator',
          'const',
          'dafpipeline',
          'Decrement',
          'Dest',
          'dest',
          'destructure',
          'destructured',
          'destructuring',
          'dict',
          'dirname',
          'eslint',
          'externalPkgs',
          'fallthrough',
          'falsy',
          'filename',
          'filenames',
          'filesystem',
          'frontendPage',
          'focusable',
          'func',
          'getter',
          'globals',
          'Goto',
          'gsadmin',
          'gzip',
          'Hant',
          'hmac',
          'hostname',
          'href',
          'html',
          'http',
          'https',
          'iframe',
          'init',
          'initializer',
          'initializers',
          'instanceof',
          'Introducer',
          'Ints',
          'ipv4',
          'javascript',
          'Jest',
          'jenkins',
          'json',
          'jsdom',
          'kkm00aqk',
          'lang',
          'Latn',
          'lifecycle',
          'linebreak',
          'linux',
          'listbox',
          'Liveness',
          'localhost',
          'lockfile',
          'logrotate',
          'lstat',
          'memberof',
          'metadata',
          'middleware',
          'minified',
          'Morehead',
          'morgan',
          'mouseover',
          'multiline',
          'namespace',
          'namespaced',
          'nginx',
          'noninteractive',
          'Nrpp',
          'obj',
          'occ',
          'ootb',
          'oracleoutsourcing',
          'param',
          'params',
          'parens',
          'pathname',
          'Pinterest',
          'polyfill',
          'preload',
          'preloaded',
          'preorderable',
          'proc',
          'programmatically',
          'proptype',
          'proptypes',
          'proto',
          'quxx',
          'radiogroup',
          'radix',
          'Raghu',
          'redeclare',
          'redeclared',
          'redisplay',
          'redisplays',
          'redux',
          'repos',
          'retransmitted',
          'rgba',
          'rollup',
          'rotator',
          'runtime',
          'saml',
          'Servlet',
          'sprintf',
          'ssl',
          'stderr',
          'stdout',
          'storeui',
          'stringifiable',
          'symlink',
          'symlinked',
          'symlinks',
          'tabbable',
          'tabindex',
          'tablist',
          'templatized',
          'testdata',
          'timestamp',
          'timestamps',
          'transpilation',
          'treegrid',
          'typeahead',
          'typeof',
          'uid',
          'unary',
          'uncomment',
          'undef',
          'unescaped',
          'Unhandled',
          'unix',
          'unresolvable',
          'updatable',
          'Urls',
          'util',
          'utils',
          'uuid',
          'UUID',
          'versa',
          'viewport',
          'wapi',
          'Webpack',
          'whitespace',
          'wildcard',
          'winston',
          'womens',
          'workspace',
          'workspaces',
          'xml',
          'xregistry',
          'yarn',
          'yarnrc',
          'zipfile',
          'zipfiles',
          'syslog',
          'desc'
        ],
        skipIfMatch: [
          'https://[^s]*',
          'http://[^s]*',
          '^[-\\w]+/[-\\w\\.]+$', //For MIME Types,
          '\\d+?(?:px)+', // For pixel values,
          "(`[a-zA-Z^`{}'_=\\s,\\(\\):$]*?`)", // ignore if within back ticks
          '<[a-zA-Z^=\\-\\"${}\\s\\/]*?>', //ignore if in html
          '([[a-zA-Z]*?])' //ignore if in [ ]
        ],
        skipWordIfMatch: [
          '^[sS]ku.*$', // ignore words that begin with sku
          '^[pP]kgs.*$', // ignore words that begin with sku
          '(?=\\S*[-])([a-zA-Z-]+)', // ignore eslint commands
          "^'.*$", // ignore words that begin with a single speech mark
          '^".*$' // ignore words that begin with a single speech mark
        ],
        minLength: 4
      }
    ]
  }
};
