/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import {fetchReturnReasons} from '@sugar-candy-framework/fetchers/merchant-settings';
import {getMerchantSettings} from '@sugar-candy-framework/commerce-utils/selector';

export default store => {
  return useEffect(() => {
    // if returnReasons is undefined, it means the fetcher didn't run
    // and client side rendering is needed.
    // else server side rendering is executed.
    const {returnReasons} = getMerchantSettings(store.getState());
    if (returnReasons === null || returnReasons === undefined) {
      fetchReturnReasons(store);
    }
  }, [store]);
};
