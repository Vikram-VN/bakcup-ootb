module.exports = {
  meta: {
    type: 'problem',
    messages: {
      noUnderscoreOOTBExports: "Custom named export '{{exportedName}}' should not have _ character"
    }
  },

  // FIXME: Should this is also consider the fact that these should be enforced only for actions/components/endpoints/initializers index/meta files?
  create: context => ({
    ExportSpecifier(node) {
      const {
        exported: {name: exportedName},
        local: {name: localName},
        parent: {source}
      } = node;

      const {value = ''} = source || {};
      // regex to match index/meta.js for plugins only
      const regex =
        /(\/|\\)(actions|components|react-components|react-widgets|endpoints|initializers|subscribers)(\/|\\)(meta|index)\.js/g;

      // Return early for non index and meta files of plugins
      if (!context.getFilename().match(regex)) {
        return;
      }

      if (
        exportedName &&
        exportedName !== 'default' &&
        exportedName.includes('_') &&
        value.indexOf('/locales') === -1
      ) {
        context.report({
          node,
          messageId: 'noUnderscoreOOTBExports',
          data: {
            exportedName,
            localName
          }
        });
      }
    }
  })
};
