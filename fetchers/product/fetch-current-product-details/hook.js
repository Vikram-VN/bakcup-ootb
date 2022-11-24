/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import {getCurrentProduct} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';
import fetchCurrentProductDetails from '@sugar-candy-framework/fetchers/product/fetch-current-product-details';

/*
 * Hook for using fetchCurrentProductDetails fetcher
 */
export default store =>
  useEffect(() => {
    if (isEmptyObject(getCurrentProduct(store.getState()))) {
      fetchCurrentProductDetails(store);
    }
  }, [store]);
