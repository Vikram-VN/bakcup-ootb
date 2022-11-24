/* eslint-disable unicorn/prefer-add-event-listener */
import {getPageId} from '@sugar-candy-framework/utils/isomorphic';

const onScriptLoadComplete = callback => event => {
  const script = event.currentTarget;

  script.onload = undefined;
  script.onerror = undefined;

  callback(true);
};

export const importScript = src =>
  new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = src;
    script.async = true;
    script.onload = onScriptLoadComplete(resolve);
    script.onerror = onScriptLoadComplete(reject);
    document.head.append(script);
  });

export const getRedirect = (fallback = 'home') => {
  const {previousPath} = history.state || {};

  const searchParams = new URLSearchParams(location.search);

  let redirect;

  if (searchParams.has('redirect')) {
    redirect = decodeURIComponent(searchParams.get('redirect'));

    if (redirect === '_prev') {
      // Null out `redirect` as "_prev" is just a token and not an actual url
      redirect = null;

      if (previousPath) {
        redirect = getPageId(new URL(previousPath, location.origin), new URL(document.baseURI).pathname).replace(
          '/',
          ''
        );
      }
    }
  }

  if (!redirect) {
    redirect = fallback;
  }

  return redirect;
};
