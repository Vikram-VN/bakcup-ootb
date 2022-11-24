/**
 * Creates a summary of a very long string.
 *
 * In fact, it shows you a portion of the beginning and the end of such string.
 *
 * @param   {string}             text       The long text.
 * @param   {number}  [keep=10]  The number of characters to show at the start and end of the text.
 * @return  {string}  Summarized text.
 */
function squeeze(text, keep = 10) {
  if (!text || typeof text !== 'string') {
    return text;
  }
  let output = '';
  keep = parseInt(keep, 10);
  if (keep < 0) {
    return output;
  }

  if (text.length <= keep) {
    output = text;
  } else if (text.length > keep && text.length < 2 * keep) {
    output = `${text.substring(0, keep)}${'...'}`;
  } else if (text.length === 2 * keep) {
    output = text;
  } else if (text.length > 2 * keep) {
    output = `${text.substring(0, keep)}...${text.substring(text.length - keep)}`;
  }

  return output;
}

function splitMultiWordIdentifier(text) {
  return text.trim().match(/^[a-z]+|[a-z]+|[A-Z][a-z]+|\d+|[A-Z]+(?![a-z])/g);
}
/**
 * Converts a string into dash-case.
 *
 * dash-case, a.k.a. kebab-case: 'hello-world'
 * camel-case: 'helloWorld'
 *
 * @param      {string}  text    The text to convert.
 * @return     {string}  The text converted to dash-case format.
 */
function dashCase(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return;
  }

  const matches = splitMultiWordIdentifier(text);

  return matches.map(word => word.toLowerCase()).join('-');
}

/**
 * Converts a string into camel-case.
 *
 * @param      {string}  text    The text to convert.
 * @return     {string}  The text converted to camel-case format.
 */
function camelCase(text) {
  const capitalize = s => s[0].toUpperCase() + s.slice(1);

  if (!text || typeof text !== 'string' || !text.trim()) {
    return;
  }

  const matches = splitMultiWordIdentifier(text);
  const capitalizedString = matches.map(word => capitalize(word)).join('');

  return capitalizedString[0].toLowerCase() + capitalizedString.slice(1);
}
/**
 * Helper methods to manipulate strings.
 */
module.exports = {squeeze, dashCase, camelCase};
