/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import fetchSite from '@sugar-candy-framework/fetchers/site/fetch-site';
import {getSite} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';

/*
 * Hook for using fetchSite fetcher
 */
export default (store, siteId) =>
  useEffect(() => {
    const site = getSite(store.getState());

    // TODO - should this check be done in the fetcher?
    // Detects if the site was populated in the state during server-side rendering
    if (isEmptyObject(site)) {
      fetchSite(store);
    }
  }, [store, siteId]);
