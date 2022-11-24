/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import fetchBillingCountries from '@sugar-candy-framework/fetchers/payments/fetch-billing-countries';
import {getBillingCountries} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';

/*
 * Hook for using fetchBillingCountries fetcher
 */
export default store =>
  useEffect(() => {
    const billingCountries = getBillingCountries(store.getState());

    if (isEmptyObject(billingCountries)) {
      // Fetch billing countries if not already present in the state
      fetchBillingCountries(store);
    }
  }, [store]);
