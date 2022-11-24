<h1>Internationalization utility</h1>

This class provides a mechanism to localize text messages.
It works by calling one of the class' methods and passing as the argument the text you want to be translated to a different locale. Then, the argument is used as the key while retrieving the text's translated version from a translation map. If a translation for the key is not found, then the original key's text is returned.

The translation map is stored in the *localized strings file* using the JSON format. In this file, the keys represent the text in English (the 'en_US' locale), and the values are their equivalent on a different locale or language. The localized strings file name is expected to have the format `LOCALE.json`, where 'LOCALE' can be any valid locale or language identifier and the file name extension is '.json'. For example, this list shows some valid localized strings file names: 'en-US.json', 'en.json', 'es-ES.json', 'fr.json', 'de-DE.json'. The localized strings files are stored on the folder specified by the class constructor's `directory` option.

The locale codes supported by this tool is defined in the *IETF BCP 47 language tag* standard. Note that these codes use the '-' (hyphen) character as the language and territory separator, e.g., 'en-US'.

<h3>Object constructor</h3>

```js
i18n(options)
```

The class constructor accepts an `options` object with a set of properties to change the behavior of the tool.
These properties are:
<dl>
  <dt>`directory`</dt>
  <dd>
    Defines the directory where the localized string files are stored. The default value is './locales'.
  </dd>
  <dt>`locale`</dt>
  <dd>
    Defines the locale code used. The Operative System's locale is used by default, but it is converted from the POSIX/Windows format to the *IETF BCP 47 format*. E.g., U.S.A. locale 'en-US'.
  </dd>
  <dt>`updateFile`</dt>
  <dd>
    Indicates if the localized keys must be added to the current locale's localized strings file the first time they are used during runtime. The default value is `false`.
  </dd>
  <dt>`fallbackToLanguage`</dt>
  <dd>
    Indicates if the tool should try to read the localized strings from a file in the same language as the current locale when the file for the exact locale is not available. The default value is `true`.
  </dd>
</dl>

<h3>Object methods</h3>

This class provides the following interchangeable methods to localize the text strings
* `t()`
* `___()` (three underscores)

The latter can also be used as a tagged literal, e.g., ``` ___`some text` ```.

For its simplicity, tagged literal is the recommended syntax to use. E.g., the following call localizes a static text:
```js
___`some text`
```
and the next one allows you to localize some text containing a value that is determined at runtime
```js
___`a value ${value}`
```

<h3>Suggested usage</h3>

This section shows a common use case of this internationalization (**i18n**) utility.

<h5>Setup</h5>

Suppose you want to localize the text messages shown in your application and use this utility to do that. The first step you would do is to import the internationalization (`I18n`) class, included in the `@sugar-candy-framework/tools-i18n` Oracle Commerce Cloud (CFW) package.

```js
// File: your-program.js
const {i18n} = require('@sugar-candy-framework/tools-i18n')
const {___, t} = i18n()
```

This implementation gives you an object constructor function (`i18n`) that you can then use to create an internationalization object (`i18n()`).
The internationalization provides two methods to localize text strings: `t` and `___` (three underscores).

<h5>Localize static text</h5>

Whenever you need to define a localizable text string that is static, use any of the i18n methods passing the text in your current locale as the function argument.
```js
// File: your-program.js
...
console.log( t('Some text to localize') )
console.log( ___('Another text') )
console.log( ___`Yet another message` )   // Tagged literals
...
```
Note that there is no need to come with an original unique key as other utilities require, but you use the actual text instead.

<h5>Localize dynamic text</h5>

Sometimes you need to localize a text including a value that is variable and is only read until the string has to be printed out. For those cases, this tool provides the following mechanism.

You use a string that contains some placeholders, besides the static parts, as the key. Then, you pass some additional function arguments that serve as the means to obtain the values that must be used to replace the placeholders at runtime. This mechanism works exactly like the Standard C library's `sprintf` function. The list of supported placeholders is described in this document [https://github.com/alexei/sprintf.js#format-specification].

Continuing with the previous example, assume you want to localize some texts that include values defined until runtime.
For that, you would do something like the following code.
```js
// File: your-program.js
...
const today = new Date()
const taxRate = 6.25
const orderNumber = 354329
console.log( t('Today is %s', today.toDateString()) ) // Prints: "Today is Thu Apr 11 2019"
console.log( ___('Tax amount: %.2f%%', taxRate) )     // Prints: "Tax amount: 6.25%"
console.log( ___`Order number: ${orderNumber}` )      // Prints: "Order number: 354329"
...
```
Note that the `'%s'` placeholder will implicitly convert the value provided in the second argument (`today.toDateString()`) to its string representation.
Other placeholders such as `'%.2f'` can be used to format the substituted value. Additionally, the percentage sign `'%'` **must** be escaped, i.e., `'%%'`.

<h5>Generating a localized strings file template</h5>

Once you finish specifying all the strings in the code that must be localized, the next step is generating the localized string files that the professional translators will use. There are two ways of doing it: manual and automatic. In any case, remember to create the `'locales'` folder in the current directory.

<h6>Manually</h6>

The manual way involves copying the string used as the key (e.g., `"Today is %s"`) every time you employ an i18n function and then adding a new property in the localized strings file (e.g., en-US.json) using the copied text as the property name and an empty string as value.
Based on the current example, so far you would have the following localized strings file:
```sh
$ cat locales/en-US.json
```
```json
{
  "Some text to localize": "",
  "Another text": "",
  "Yet another message": "",
  "Today is %s": "",
  "Tax amount: %.2f%%": "",
  "Order number: %s": ""
}
```

<h6>Automatically</h6>

When the i18n object's configuration has the `updateFile` option set to `true`, the localized strings file is updated every time an i18n's function is used during runtime.

To automatically create the localized strings file, you must run your program in a way that most of the localized strings are used. This procedure probably will require you to execute the program multiple times. You might have to manually add to the localized strings file those strings that are part of an execution path that is rarely exercised, e.g., error messages.

<h5>Localizing the program's strings</h5>

Once you have the complete version of the localized strings file for the current locale, it can be used as a template to create other locale or language-specific versions.

Based on the ongoing example and assuming you want to localize the program for the Germany locale, you would do the following:

1. Create a copy of the `locales/en-US.json` file and save it with the name `locales/de-DE.json`.
```sh
$ cat locales/de-DE.json
```
```json
{
    "Some text to localize": "",
    "Another text": "",
    "Yet another message": "",
    "Today is %s": "",
    "Tax amount: %.2f%%": "",
    "Order number: %s": ""
}
```

2. Replace the empty strings in the file with the translated version of its key. Be extra careful to include, in the right place, any existing placeholder. For practical purposes, we can assume that any text wrapped with the `'[de]'` tag represents the German version of said text.
```sh
$ cat locales/de-DE.json
```
```json
{
    "Some text to localize": "[de] Some text to localize [de]",
    "Another text": "[de] Another text [de]",
    "Yet another message": "[de] Yet another message [de]",
    "Today is %s": "[de] Today is %s [de]",
    "Tax amount: %.2f%%": "[de] Tax amount: %.2f%% [de]",
    "Order number: %s": "[de] Order number: ${orderNumber} [de]"
}
```

You can repeat steps one and two to localize the program into other locales or languages.

Sometimes you might want to localize your program for a language and not a specific locale. E.g., let's say you want to create a single French localization that could be used when the program runs in both the `'fr-FR'` and `'fr-CA'` locales. To achieve this, you would have to:

1. Save a copy of the localized strings template file as `locales/fr.json`
```sh
$ cat locales/fr.json
```
```json
{
    "Some text to localize": "",
    "Another text": "",
    "Yet another message": "",
    "Today is %s": "",
    "Tax amount: %.2f%%": "",
    "Order number: %s": ""
}
```

2. Replace the empty strings in the file with the translated version of its key. In the same way as before, we assume that any text wrapped with the `'[fr]'` tag represents the French version of said text.
```sh
$ cat locales/fr.json
```
```json
{
    "Some text to localize": "[fr] Some text to localize [fr]",
    "Another text": "[fr] Another text [fr]",
    "Yet another message": "[fr] Yet another message [fr]",
    "Today is %s": "[fr] Today is %s [fr]",
    "Tax amount: %.2f%%": "[fr] Tax amount: %.2f%% [fr]",
    "Order number: %s": "[fr] Order number: ${orderNumber} [fr]"
}
```

Now, this localized strings file will be used every time the program runs in a French-based locale. Note the `fallbackToLanguage`'s value had to be `true` for this feature to work, which is the default.

<h5>Testing the localized program</h5>

Presumably, you would want to ensure that your program shows the localized strings when it runs in a supported locale. The suggested way to achieve that is by changing the shell's locale temporarily while your program runs. In Unix-based systems, you can achieve this by preceding a terminal command with the `LANG` environment variable set to the chosen locale. Beware that the `LANG` environment variable expects the locale to be in the POSIX format, i.e., the language and country separator is an underscore (`'_'`) instead of a hyphen, and it might include the encoding, e.g., `'en_US.UTF-8'`.

To test the program used in the previous example, you could do the following:

* Add the `'@sugar-candy-framework/tools-i18n'` dependency to your `package.json` file
```sh
$ yarn add '@sugar-candy-framework/tools-i18n'
```

* Run the program in the default `'en-US'` locale
  ```sh
  $ node your-program.js
  Some text to localize
  Another text
  Yet another message
  Today is Fri Apr 19 2019
  Tax amount: 6.25%
  Order number: 354329
  ```

* Now, run it in the German (`'de-DE'`) locale
  ```sh
  $ LANG='de_DE.UTF-8' node your-program.js
  [de] Some text to localize [de]
  [de] Another text [de]
  [de] Yet another message [de]
  [de] Today is Fri Apr 19 2019 [de]
  [de] Tax amount: 6.25% [de]
  [de] Order number: 354329 [de]
  ```

* You get the same output when the program runs in either the France (`'fr-FR'`) or the Canadian French (`'fr-CA'`) locales
  ```sh
  $ LANG='fr-FR' node your-program.js
  [fr] Some text to localize [fr]
  [fr] Another text [fr]
  [fr] Yet another message [fr]
  [fr] Today is Fri Apr 19 2019 [fr]
  [fr] Tax amount: 6.25% [fr]
  [fr] Order number: 354329 [fr]

  $ LANG='fr-CA' node your-program.js
  [fr] Some text to localize [fr]
  [fr] Another text [fr]
  [fr] Yet another message [fr]
  [fr] Today is Fri Apr 19 2019 [fr]
  [fr] Tax amount: 6.25% [fr]
  [fr] Order number: 354329 [fr]
  ```
