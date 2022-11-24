const getCookie = (cookies, key) => {
  if (!cookies || !key) {
    return;
  }

  return cookies
    .trim()
    .split(/; */)
    .find(cookie => new RegExp(`^${key}=`).test(cookie));
};

const getCookieValue = (cookies, key) => {
  const cookie = getCookie(cookies, key);

  if (cookie) {
    return decodeURIComponent(cookie.replace(new RegExp(`^${key}=`), '').trim());
  }
};

const splitSetCookieString = cookies => {
  if (typeof cookies !== 'string') return [];

  let start = 0,
    curPos = 0,
    lastComma = -1,
    nextStart = 0,
    cookiesSeparatorFound = false;
  const listOfCookie = [];
  const cookiesLength = cookies.length;

  const skipWhiteSpaces = () => {
    while (curPos < cookiesLength && /\s/.test(cookies.charAt(curPos))) {
      curPos += 1;
    }

    return curPos < cookiesLength;
  };

  const isSpecialCharacter = char => {
    return char === '=' || char === ',';
  };

  while (skipWhiteSpaces()) {
    if (cookies.charAt(curPos) === ',') {
      //look for a next = to mark the start of next cookie
      lastComma = curPos;
      curPos += 1;
      skipWhiteSpaces();
      nextStart = curPos;
      while (curPos < cookiesLength && !isSpecialCharacter(cookies.charAt(curPos))) {
        curPos += 1;
      }
      if (curPos < cookiesLength && cookies.charAt(curPos) === '=') {
        cookiesSeparatorFound = true;
        listOfCookie.push(cookies.substring(start, lastComma));
        start = nextStart;
      }
    } else {
      curPos += 1;
    }
  }
  if (!cookiesSeparatorFound || curPos >= cookiesLength) {
    listOfCookie.push(cookies.substring(start, cookiesLength));
  }

  return listOfCookie;
};

const getCookieFromSetCookieHeader = (cookieHeader, key) => {
  if (!cookieHeader || !key) {
    return;
  }

  const listOfCookies = splitSetCookieString(cookieHeader);

  return listOfCookies.find(cookie => new RegExp(`^${key}=`).test(cookie));
};

const getValueFromSetCookieHeader = (cookieHeader, key) => {
  const cookie = getCookieFromSetCookieHeader(cookieHeader, key);

  return getCookieValue(cookie, key);
};

module.exports = {
  getCookie,
  getCookieValue,
  getCookieFromSetCookieHeader,
  getValueFromSetCookieHeader
};
