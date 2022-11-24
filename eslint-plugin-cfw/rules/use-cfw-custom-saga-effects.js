module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      noEffectImportsThatAreNotOCCVersion: "@sugar-candy-framework/store/utils provides custom effect '{{importName}}'."
    }
  },

  create: context => ({
    ImportSpecifier(node) {
      const {imported, parent} = node;

      const effectsProvidedByStoreUtils = ['takeEvery', 'takeLatest', 'takeLeading', 'takeOnce'];
      if (
        parent.type === 'ImportDeclaration' &&
        parent.source.value === 'redux-saga/effects' &&
        effectsProvidedByStoreUtils.includes(imported.name)
      ) {
        context.report({
          node,
          messageId: 'noEffectImportsThatAreNotOCCVersion',
          data: {
            importName: imported.name
          }
        });
      }
    }
  })
};
