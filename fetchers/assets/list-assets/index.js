/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {getAssetsFetcherData} from '@sugar-candy-framework/fetchers/assets/selectors';

/**
 * Fetcher that uses the 'listAssets' action to fetch a list of assets.
 */
export const fetchAssets = async store => {
  const {pageId} = getAssetsFetcherData(store.getState());

  // Default number of assets per page, this could come from component configuration at some point.
  const PAGE_SIZE = 20;

  // eslint-disable-next-line no-undef
  const {searchParams} = new URL(pageId, 'http://x');

  const limit = searchParams.get('limit') ? searchParams.get('limit') || PAGE_SIZE : PAGE_SIZE;
  const offset = searchParams.get('offset') ? searchParams.get('offset') || 0 : 0;
  const expand = searchParams.get('expand');
  const rootAssetsOnly = searchParams.get('rootAssetsOnly');

  return store.action('listAssets', {limit, offset, expand, rootAssetsOnly});
};

export default fetchAssets;
