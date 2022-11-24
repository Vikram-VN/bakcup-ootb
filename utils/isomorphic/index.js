import {normalizePath} from '@sugar-candy-framework/utils/generic';

export const getPageId = (url, baseURI = '/') => {
  console.assert(
    typeof url.pathname === 'string' && typeof url.search === 'string',
    'Invalid argument "url"--expected an instance of URL or Location'
  );

  let {pathname} = url;

  pathname = normalizePath(pathname);

  // Remove baseURI
  pathname = pathname.replace(new RegExp(`^${baseURI}`), '/');

  // Remove client defaulting logic when server defaulting is fixed
  if (pathname === '/') {
    pathname = '/home/';
  }

  return `${pathname}${url.search}`;
};
