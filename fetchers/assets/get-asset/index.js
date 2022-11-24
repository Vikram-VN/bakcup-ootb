/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getAssetFetcherData} from '@sugar-candy-framework/fetchers/assets/selectors';

/**
 * Fetcher that uses the 'getAsset' action to fetch an asset.
 */
export const fetchAsset = async store => {
  const {pageId} = getAssetFetcherData(store.getState());

  // eslint-disable-next-line no-undef
  const {searchParams} = new URL(pageId, 'http://x');
  const expand = searchParams.get('expand') || 'occ_upgradeOptions,descendantAssets';
  const assetId = searchParams.get('assetId');

  store.action('getAsset', {assetId, expand});
};

export default fetchAsset;
