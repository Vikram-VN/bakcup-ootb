/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import {fetchShopperSettings} from '@sugar-candy-framework/fetchers/merchant-settings';
import {getShopperSettings, getPasswordPolicies} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';

export default store =>
  // invoke fetcher if server-side rendering isn't executed
  useEffect(() => {
    const shopperSettings = getShopperSettings(store.getState());
    const passwordPolicies = getPasswordPolicies(store.getState());
    if (isEmptyObject(shopperSettings) || isEmptyObject(passwordPolicies)) {
      fetchShopperSettings(store);
    }
  }, [store]);
