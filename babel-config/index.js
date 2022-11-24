/* eslint-env node */
module.exports = {
  presets: ['@babel/react'],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-syntax-dynamic-import'],
  env: {
    test: {
      presets: [
        [
          '@babel/env',
          {
            targets: {node: 'current'},
            loose: true,
            useBuiltIns: false
          }
        ]
      ],
      plugins: ['dynamic-import-node', ['@babel/plugin-proposal-private-methods', {loose: false}]]
    },
    production: {
      plugins: [
        'transform-react-remove-prop-types',
        {
          mode: 'remove',
          removeImport: true
        }
      ]
    }
  }
};
