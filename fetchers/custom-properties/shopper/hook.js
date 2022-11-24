/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import {fetchShopperCustomProperties} from '@sugar-candy-framework/fetchers/custom-properties';
import {profileCustomPropertiesExistById} from '@sugar-candy-framework/commerce-utils/selector';

export default store =>
  // invoke fetcher if server-side rendering isn't executed
  useEffect(() => {
    if (!profileCustomPropertiesExistById(store.getState(), 'user')) {
      fetchShopperCustomProperties(store);
    }
  }, [store]);
