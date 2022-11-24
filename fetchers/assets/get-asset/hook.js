/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getAssets} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';
import {useEffect} from 'react';
import {fetchAsset} from '@sugar-candy-framework/fetchers/assets';

/**
 * A useEffect hook to use the fetchAsset fetcher during client-side rendering.
 */
export const useAssetFetcher = (store, {pageId, assetId}) => {
  const assets = getAssets(store.getState());

  return useEffect(() => {
    const asset = assets[assetId];

    if (isEmptyObject(asset)) {
      // Only fetch an asset if it's not already present in the state.
      fetchAsset(store, {pageId});
    }
  }, [pageId, store, assetId, assets]);
};

export default useAssetFetcher;
