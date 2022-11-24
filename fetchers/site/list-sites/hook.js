/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import {fetchAllSites} from '@sugar-candy-framework/fetchers/site';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';
import {getSites} from '@sugar-candy-framework/commerce-utils/selector';

export default store =>
  useEffect(() => {
    const sites = getSites(store.getState());

    if (isEmptyObject(sites)) {
      // Fetch all sites if they aren't already present in the state
      fetchAllSites(store);
    }
  }, [store]);
