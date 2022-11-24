/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import fetchShippingCountries from '@sugar-candy-framework/fetchers/shipping-countries/fetch-shipping-countries';
import {getShippingCountries} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';

/*
 * Hook for using fetchShippingCountries fetcher
 */
export default store =>
  useEffect(() => {
    const shippingCountries = getShippingCountries(store.getState());

    // TODO - should this check be done in the fetcher?
    // Detects if the site was populated in the state during server-side rendering
    if (isEmptyObject(shippingCountries)) {
      fetchShippingCountries(store);
    }
  }, [store]);
