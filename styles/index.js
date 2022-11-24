export {default as common} from '@sugar-candy-framework/styles/common.css';
export {default as desktop} from '@sugar-candy-framework/styles/desktop.css';
export {default as mobile} from '@sugar-candy-framework/styles/mobile.css';

/*
  Generate an inline style tag for base css, e.g. `<style>${common + (isMobile ? mobile : desktop)}</style>`.
 */
export const getBaseStyleTag = (styles, isMobile, siteId, locale) => {
  const siteSpecificStyles = styles[siteId] || {};
  const localeSpecificStyles = styles[locale] || {};
  const common = (siteSpecificStyles.common || '') + (localeSpecificStyles.common || '') || styles.common || '';
  const desktop = (siteSpecificStyles.desktop || '') + (localeSpecificStyles.desktop || '') || styles.desktop || '';
  const mobile = (siteSpecificStyles.mobile || '') + (localeSpecificStyles.mobile || '') || styles.mobile || '';
  const css = common + (isMobile ? mobile : desktop);

  return css ? `<style>${css}</style>` : '';
};
