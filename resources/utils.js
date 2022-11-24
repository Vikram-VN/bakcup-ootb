/**
 * It bundles the widget specific resource keys with the supported locales from resource bundle.
 *
 * @param {*} resourceBundle
 * @param {*} keys
 * @param {*} resources
 */
export const buildResources = (resourceBundle, keys, resources = {}) => {
  const languages = Object.keys(resourceBundle || {});

  languages.forEach(lang => {
    if (lang === '__esModule') {
      return;
    }

    const resourcesForLanguage = keys.reduce((res, key) => {
      if (resourceBundle[lang] && resourceBundle[lang][key]) {
        res[key] = resourceBundle[lang][key];
      } else {
        res[key] = `${lang}-${key}`;
      }

      return res;
    }, {});

    const locale = lang.replace('_', '-');
    if (!resources[locale]) resources[locale] = {};
    resources[locale] = Object.assign(resources[locale], resourcesForLanguage);
  });

  return resources;
};

/**
 * It bundles the widget configuration resource keys with the supported locales from resource bundle.
 *
 * @param {*} resourceBundle
 * @param {*} keys
 * @param {*} localeResources
 */
export const buildConfigResources = (resourceBundle, keys, localeResources = {}) => {
  const languages = Object.keys(resourceBundle);

  languages.forEach(lang => {
    if (lang === '__esModule') {
      return;
    }

    const resourcesForLanguage = keys.reduce((res, key) => {
      if (resourceBundle[lang] && resourceBundle[lang][key]) {
        res[key] = resourceBundle[lang][key];
      } else {
        res[key] = `${lang}-${key}`;
      }

      return res;
    }, {});

    const locale = lang.replace('_', '-');
    if (!localeResources[locale]) {
      localeResources[locale] = {};
    }
    if (!localeResources[locale].resources) {
      localeResources[locale].resources = {};
    }

    localeResources[locale].resources = Object.assign(localeResources[locale].resources, resourcesForLanguage);
  });

  return localeResources;
};
