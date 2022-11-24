/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

// IMPORTANT: Make sure below template is prettier friendly to avoid prettier errors after eslint auto fix.
const newFileCopyrightString = `/*
 ** Copyright (c) ${new Date().getFullYear()} Oracle and/or its affiliates.
 */`;

// Hard-coded regexp for copyright string... Refer to commented code to generate the proper RegExp for template.
// const oldCopyrightRegexpString = /\/\*[\s\S][\s+]\*\*[\s+]Copyright[\s+]\(c\)[\s+]20\d{2}[\s+]Oracle[\s+]and\/or[\s+]its[\s+]affiliates\.[\s+]All[\s+]rights[\s+]reserved\.[\s\S][\s+]\*\*[\s+]Licensed[\s+]under[\s+]the[\s+]Universal[\s+]Permissive[\s+]License[\s+]v[\s+]1\.0[\s+]as[\s+]shown[\s+]at[\s+]https:\/\/oss\.oracle\.com\/licenses\/upl[\s\S][\s+]\*\//im;

const oldCopyrightRegexpString =
  /\/\*[\s\S][\s+]\*\*[\s+]Copyright[\s+]\(c\)[\s+]20\d{2}[\s+]Oracle[\s+]and\/or[\s+]its[\s+]affiliates\.[\s\S][\s+]\*\//im;

const newFileCopyrightRegexpString =
  /\/\*[\s\S][\s+]\*\*[\s+]Copyright[\s+]\(c\)[\s+]20\d{2}[\s+]Oracle[\s+]and\/or[\s+]its[\s+]affiliates\.[\s\S][\s+]\*\//im;

const modifiedFileCopyrightRegexpString =
  /\/\*[\s\S][\s+]\*\*[\s+]Copyright[\s+]\(c\)[\s+]20\d{2}[\s+]Oracle[\s+]and\/or[\s+]its[\s+]affiliates\.[\s\S][\s+]\*\//im;

module.exports.newFileCopyrightString = newFileCopyrightString;
module.exports.oldCopyrightRegexpString = oldCopyrightRegexpString;
module.exports.newFileCopyrightRegexpString = newFileCopyrightRegexpString;
module.exports.modifiedFileCopyrightRegexpString = modifiedFileCopyrightRegexpString;
/*
// AUTO GENERATE REGEXP FROM TEMPLATE
const _ = require('lodash');
const YEAR = new Date().getFullYear();
const YEAR_REGEXP = /20\d{2}/;
const escapeRegExp = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
// IMPORTANT: Make sure below template is prettier friendly to avoid prettier errors after eslint auto fix.
/!*const _copyrightTemplate = `/!*
 ** Copyright (c) <%= YEAR %> Oracle and/or its affiliates. All rights reserved.
 ** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl
 *!/
`;*!/
const buildexp = String(_.template(escapeRegExp(_copyrightTemplate))({ YEAR: '20\\d{2}' }).replace(/\n\s+/mg, '[\\s\\S]').replace(/ /mg, '[\\s+]')).trim();
const copyrightRegexp = new RegExp(buildexp, 'mi');
console.log(copyrightRegexp.source);
*/
