/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getAssets} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';
import {useEffect} from 'react';
import {fetchAssets} from '@sugar-candy-framework/fetchers/assets';

/**
 * A useEffect hook to use the fetchAssets fetcher during client-side rendering.
 */
export const useAssetsFetcher = (store, {pageId}) => {
  return useEffect(() => {
    const assets = getAssets(store.getState());

    if (isEmptyObject(assets)) {
      // Only fetch assets if they're not already present in the state.
      fetchAssets(store, {pageId});
    }
  }, [pageId, store]);
};

export default useAssetsFetcher;
