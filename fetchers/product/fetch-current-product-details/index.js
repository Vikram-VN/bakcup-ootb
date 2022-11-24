/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {createFetcher} from '@sugar-candy-framework/fetchers/factory';
import fetchCurrentProductPrices from '@sugar-candy-framework/fetchers/product/fetch-current-product-prices';
import fetchCurrentProductStockStatus from '@sugar-candy-framework/fetchers/product/fetch-current-product-stock-status';

/*
 * Create `memoized` fetcher
 */
export default createFetcher(null, null, [fetchCurrentProductPrices, fetchCurrentProductStockStatus]);
