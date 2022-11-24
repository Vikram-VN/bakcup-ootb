module.exports = {
  plugins: ['@sugar-candy-framework/eslint-plugin-cfw'],
  extends: ['../base/index.js'].map(require.resolve),
  rules: {
    'react/prop-types': 'off', // TODO: cfw's take on this from base config?
    'react/forbid-prop-types': 'off', // TODO: Enable forbid-prop-type after proper fixes are in
    'react/display-name': 'off'
  }
};
