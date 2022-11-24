/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import fetchPaymentConfigurations from '@sugar-candy-framework/fetchers/payments/fetch-payment-configurations';
import {getPaymentConfigurations} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';

/*
 * Hook for using fetchPaymentConfigurations fetcher
 */
export default store =>
  useEffect(() => {
    const paymentConfiguration = getPaymentConfigurations(store.getState());

    if (isEmptyObject(paymentConfiguration)) {
      // Fetch payment configuration if not already present in the state
      fetchPaymentConfigurations(store);
    }
  }, [store]);
