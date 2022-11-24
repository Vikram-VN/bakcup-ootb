module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    description: 'Avoid namespace conflicts in actions, components and other plugins from OOTB plugins',
    messages: {
      customExportsNeedUnderscoreMsg: `Custom named export '{{exportedName}}' should start with an underscore. Example: {{exportedName}} as _{{exportedName}}'`
    }
  },

  // FIXME: Should this is also consider the fact that these should be enforced only for actions/components/endpoints/initializers index/meta files?
  // This convention of naming exports with _ is enforcing snake_case and can cause issues with camelCase rule (ignores leading and trailing _ in code), how do we take on this?
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

      // if file is not in **/plugins/<pluginType>/index.js, **/plugins/<pluginType>/meta.js just return it.
      // Checks need to happen and build and deploy times to check for actual conflicts for workspaces that don't stick to conventions

      if (
        exportedName &&
        exportedName !== 'default' &&
        !exportedName.includes('_') &&
        value.indexOf('/locales') === -1
      ) {
        context.report({
          node,
          messageId: 'customExportsNeedUnderscoreMsg',
          data: {
            exportedName,
            localName
          },
          fix(fixer) {
            if (!exportedName.length) {
              // Can't auto-fix empty named exports
              return;
            }

            return [fixer.replaceText(node, `${node.local.name || node.exported.name} as _${node.exported.name}`)];
          }
        });
      }
    }
  })
};
