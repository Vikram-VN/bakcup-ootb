const ootbNamedExports = require('./rules/no-underscore-ootb-exports');
const reduxSagaEffectsShouldUseOCCVersion = require('./rules/use-cfw-custom-saga-effects');
const copyright = require('./rules/copyright');

module.exports = {
  rules: {
    'use-cfwcustom-saga-effects': reduxSagaEffectsShouldUseOCCVersion,
    'no-underscore-ootb-exports': ootbNamedExports,
    'copyright': copyright
  },
  /* Use the below in .eslintrc to use the plugin with the config defined below.
      "extends": [
        "plugin:@sugar-candy-framework/eslint-plugin-eslint-plugin-cfw/recommended"
      ]
  */
  configs: {
    recommended: {
      plugins: ['@sugar-candy-framework/eslint-plugin-cfw'],
      rules: {
        '@sugar-candy-framework/eslint-plugin-cfw/no-underscore-ootb-exports': 'off',
        '@sugar-candy-framework/eslint-plugin-cfw/oracle-copyright': 'off',
        '@sugar-candy-framework/eslint-plugin-cfw/use-eslint-plugin-cfw-custom-saga-effects': 'off'
      }
    },
    internal: {
      plugins: ['@sugar-candy-framework/eslint-plugin-cfw'],
      rules: {
        '@sugar-candy-framework/eslint-plugin-cfw/no-underscore-ootb-exports': 'off',
        '@sugar-candy-framework/eslint-plugin-cfw/oracle-copyright': 'off'
      }
    }
  }
};
