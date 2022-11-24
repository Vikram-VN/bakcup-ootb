/**
 * Internationalization utility.
 *
 * @module @sugar-candy-framework/tools-i18n.I18n
 */

const fs = require('fs');
const systemLocale = require('os-locale');
const path = require('path');
const {vsprintf} = require('sprintf-js');

const locales = () => require('./locales');

/**
 * Internationalization utility.
 *
 * This class provides a mechanism to localize text messages.
 * It works by calling one of the class' methods and passing as the argument the text you want to be translated to a different locale.
 * Then, the argument is used as the key while retrieving the text's translated version from a translation map. If a translation for the key is not found, then the original key's text is returned.
 *
 * The localized strings file is a JSON object in which the keys represent the text in English (the 'en_US' locale), and the values are the text localized into a different locale or language.
 * The localized strings file name is expected to have the format <code>LOCALE.json</code>, where 'LOCALE' can be any valid locale or language identifier, and the file name extension is '.json'.
 * For example, this list shows some valid localized strings file names: 'en_US.json', 'en.json', 'es_ES.json', 'fr.json', 'de_DE.json'.
 * The localized strings files are stored on the folder specified by the <code>directory</code> option.
 *
 * The locale codes supported by this tool is defined in the 'IETF BCP 47 language tag' standard.
 * Note that these codes use the '-' (hyphen) character as the language and territory separator, e.g., 'en-US'.
 *
 * @see {@link README.i18n.js} for further information.
 * @class I18n
 */
class I18n {
  /**
   * Constructs an internationalization object.
   *
   * @param {Object} [options={}] - The options to configure the internationalization object.
   * @param {string} [options.directory='./locales']  - The locales directory.
   * @param {string} options.locale      - The locale to use.
   * @param {boolean} [options.updateFile=false] - If `true`, updates the localization strings file (for the system locale) when new localized strings are found.
   * @param {boolean} [options.fallbackToLanguage=true] - If `true`, tries to get the localized strings from a file for the locale's language when a file for the exact locale is not found.
   */
  constructor(options = {}) {
    if (!(this instanceof I18n)) {
      throw new Error("I18n needs to be called with the 'new' keyword");
    }

    this.directory = options.directory || './locales';
    this.locale = options.locale || this.osLocale;
    this.updateFile = options.updateFile === undefined ? false : Boolean(options.updateFile);
    this.fallbackToLanguage = options.fallbackToLanguage === undefined ? true : Boolean(options.fallbackToLanguage);

    this.strings = this.getBestMatchingStrings();
    this.stringsInitialLength = Object.keys(this.strings).length;
    this.updateFile && this.registerClosingListener();

    if (options.locale && !locales().validate(options.locale)) {
      throw new Error(`Invalid locale option: '${options.locale}'`);
    }
  }

  /**
   * Returns the Operative System's locale in the 'IETF BCP 47' format.
   *
   * @returns {string} - Operative System's locale in the 'IETF BCP 47' format.
   */
  get osLocale() {
    return this.normalize(systemLocale.sync());
  }

  /**
   * Converts the language and region separator in a POSIX-based locale to the 'IETF BCP 47' standard.
   *
   * Canonicalizes a locale in the 'ISO/IEC 15897' standard to the 'IETF BCP 47' standard.
   * Locales based on the 'IETF BCP 47 language tag' format use the '-' (hyphen) character as the language and territory separator. E.g., 'en-US'.
   * Locales based on the 'ISO/IEC 15897' format use the '_' (underscore) character as the language and territory separator. E.g., 'en_US'.
   *
   * @param {string} locale  - The locale to normalize.
   */
  normalize(locale) {
    const parts = locale.split(/[-_]/);
    let str = parts[0];

    if (parts[1]) {
      str += `-${parts[1].toUpperCase()}`;
    }

    return str;
  }

  /**
   * Get the first part of the locale, i.e., the language.
   *
   * @param {string} locale - A locale.
   * @returns {string} - The short part of the locale string.
   */
  localeLenguage(locale = this.locale) {
    return locale.substr(0, 2);
  }

  /**
   * Obtains the absolute path to the localized strings file.
   *
   * It is assumed that the localized strings filename will have the '.json' extension.
   *
   * @param      {string}  [locale=this.locale] - The locale.
   * @return     {string}  - Path to the localized strings file.
   */
  localizedStringsFile(locale = this.locale) {
    return path.resolve(`${this.directory}/${locale}.json`);
  }

  /**
   * Tries to get the best matching localized strings.
   *
   * This method first tries to read the localized strings from a file in the locales folder that matches the locale configured.
   * If this attempt fails, then it tries to read them from a file that matches the locale's language.
   * In the case that no suitable file can be found, the method returns an empty object.
   *
   * @returns {Object} - A localized strings map, or an empty object if it could not find a source.
   */
  getBestMatchingStrings() {
    let localizedStrings = {};
    try {
      // First, try for an exact match for the supplied locale, e.g.: es-ES
      localizedStrings = require(this.localizedStringsFile());
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }

      // Then, try for a language match.
      if (this.fallbackToLanguage) {
        try {
          // Language-only locale, e.g.: es
          localizedStrings = require(this.localizedStringsFile(this.localeLenguage(this.locale)));
        } catch (e) {
          // In a lost case, fallback to display the keys.
          // Usually, this happens when either the 'locales' directory or the localized strings file are missing.
          if (e.code !== 'MODULE_NOT_FOUND') {
            throw e;
          }
        }
      }
    }

    return localizedStrings;
  }

  /**
   * Registers an event listener to create or update the localized strings file when the app is closing.
   */
  registerClosingListener() {
    // Increase the process's maximum number of listener by 1 since each new i18n instance wants
    // to be notified when the program is about to finish so it can update its localized strings
    // file. The intention is to keep this memory leak detection mechanism in place and
    // accommodate this utility's requirement.
    process.setMaxListeners(process.getMaxListeners() + 1);
    this.updateLocales = this.updateLocales.bind(this);
    process.on('exit', this.updateLocales);
  }

  /**
   * Saves or updates the localized strings file.
   *
   * The data is read from the `this.strings` cache and saved on the file specified by the `this.localizedStringsFile()` method.
   *
   * Be aware the whole file content is overwritten with the in-memory cache content, which could present a problem in the case that you modify the file externally before the app using this utility finishes.
   *
   * If something fails, the Node app is closed with an error exit code.
   */
  updateLocales() {
    // Decrement the process's maximum number of listener by 1 and remove the event listener.
    process.removeListener('exit', this.updateLocales);
    process.setMaxListeners(process.getMaxListeners() - 1);

    if (Object.keys(this.strings).length === this.stringsInitialLength) {
      // Do not write the localized strings file if nothing has changed.
      return;
    }

    try {
      fs.writeFileSync(this.localizedStringsFile(), JSON.stringify(this.strings, null, 2));
    } catch (e) {
      console.log(`(i18n) Error. Failed to save the localized strings to: ${this.localizedStringsFile()}`);
      console.log(`(i18n) Does the '${path.resolve(this.directory)}' folder exist?`);
      process.exitCode = 1;
    }
  }

  /**
   * Returns the localized version of the `key` provided.
   *
   * A key is the actual English text itself.
   * The `key` value is returned if it does not exist in the localization strings cache. E.g.,
   * ```js
   * t('Hello World')
   * ```
   * will return the <code>'Hello World'</code> string if no localization strings exists or if the system's locale is 'en_US'.
   *
   * A placeholder substitution is performed if the `key` text contains placeholders and an equal number of additional arguments is provided.
   * E.g., the function call
   * ```js
   * t('Today is %s', (new Date()).toDateString())
   * ```
   * did (at some point in time) return the <code>"Today is Thu Apr 11 2019"</code> text.
   *
   * You can define _positional arguments_ in the code with the token '%NUMBER$s',
   * for example,
   * ```js
   * t('ascending: %1$s, %2$s, and %3$s', 'one', 'two', 'three')
   * ```
   * and then change in the localized strings file the order on which the arguments are used to construct the localized text
   * ```js
   * // File: locales/en-AU.json
   * {
   *   "ascending: %1$s, %2$s, and %3$s": "descending: %3$s, %2$s, and %1$s"
   * }
   * ```
   * You can use _named arguments_ in the code with the token '%(NAME)s',
   * for example,
   * ```js
   * t('order: %(one)s, %(two)s, and %(three)s', {one: 'first', two: 'second', three: 'third'})
   * ```
   * and then change in the localized strings file the order on which the arguments are used to construct the localized text
   * ```js
   * // File: locales/en-AU.json
   * {
   *   "order: %(one)s, %(two)s, and %(three)s": "reverse order: %(three)s, %(two)s, and %(one)s"
   * }
   * ```
   *
   * The supported placeholders are described here: https://github.com/alexei/sprintf.js#format-specification.
   *
   * @param  {string}    key    - The actual English text itself. May include placeholders.
   * @param  {...string} [args] - The values used to replace the placeholders.
   * @return {string}    - The localized version of the key, or the key itself if no replacement is found.
   */
  t(key, ...args) {
    let text = key;
    if (this.strings[key]) {
      // Find the text for the key.
      text = this.strings[key];
    } else {
      // Create a new entry in the localization map.
      this.strings[key] = '';
    }

    return vsprintf(text, args);
  }

  /**
   * Returns the localized version of the `key` provided.
   *
   * A key is the actual English text itself.
   * The `key` value is returned if it does not exist in the localization strings cache. E.g.,
   * ```js
   * ___('Hello World')
   * ```
   * will return the <code>'Hello World'</code> string if no localization strings exists or if the system's locale is 'en_US'.
   *
   * A placeholder substitution is performed if the `key` text contains placeholders and an equal number of additional arguments is provided.
   * E.g., the function call
   * ```js
   * ___('Today is %s', (new Date()).toDateString())
   * ```
   * did (at some point in time) return the `"Today is Thu Apr 11 2019"` text.
   *
   * The supported placeholders are described here: https://github.com/alexei/sprintf.js#format-specification.
   *
   * This method is interchangeable with the I18n#t method.
   * However, it also supports the use of _tagged literals_.
   * E.g., the previous examples can be written as
   * ```js
   * ___`Hello world`
   * ___`Today is ${(new Date()).toDateString()}`
   * ```
   *
   * You can define _positional arguments_ with the token '%NUMBER$s',
   * for example, writing in the code
   * ```js
   * ___('ascending A: %1$s, %2$s, and %3$s', 'one', 'two', 'three')
   * // Using tagged literals
   * ___`ascending B: ${'one'}, ${'two'}, and ${'three'}`
   * ```
   * and then change in the localized strings file the order on which the arguments are used to construct the localized text
   * ```js
   * // File: locales/en-AU.json
   * {
   *   "ascending A: %1$s, %2$s, and %3$s": "descending A: %3$s, %2$s, and %1$s",
   *   "ascending B: %s, %s, and %s": "descending B: %3$s, %2$s, and %1$s"
   * }
   * ```
   * You can use _named arguments_ with the token '%(NAME)s',
   * for example, defining in the code
   * ```js
   * ___('order: %(one)s, %(two)s, and %(three)s', {one: 'first', two: 'second', three: 'third'})
   * ```
   * and then change in the localized strings file the order on which the arguments are used to construct the localized text
   * ```js
   * // File: locales/en-AU.json
   * {
   *   "order: %(one)s, %(two)s, and %(three)s": "reverse order: %(three)s, %(two)s, and %(one)s"
   * }
   * ```
   *
   *
   * @param  {string}    key    - The actual English text itself. May include placeholders.
   * @param  {...string} [args] - The values used to replace the placeholders.
   * @return {string}    - The localized version of the key, or the key itself if no replacement is found.
   */
  ___(key, ...args) {
    let text = key;
    if (typeof key !== 'string') {
      text = [].slice.call(key).join('%s');
    }

    return this.t(text, ...args);
  }
}

/**
 * Returns an internationalization object that is ready to use.
 *
 * @param {Object} [options={}] - The options to configure the internationalization object.
 * @param {string} [options.directory='./locales']  - The locales directory.
 * @param {string} [options.locale='en-US']         - The locale to use. The OS's locale is the default value.
 * @param {boolean} [options.updateFile=false]      - If `true`, updates the localization strings file when new localized strings are found.
 * @param {boolean} [options.fallbackToLanguage=true] - If `true`, tries to get the localized strings from a file for the locale's language when a file for the exact locale is not found.
 * @return {I18n} - A new I18n configured object.
 */
module.exports = function (options) {
  const i18n = new I18n(options);

  // Attach (bind) the new I18n object to the following methods so the former is not lost when calling the latter.
  // In other words, later when you call one of the instance methods (e.g., 't'), the 'this' object reference will point to the new I18n object, instead of pointing to an undefined 'this' object.
  i18n.t = i18n.t.bind(i18n);
  i18n.___ = i18n.___.bind(i18n);

  return i18n;
};
