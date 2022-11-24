/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getPage, getRequestContext, getAssets} from '@sugar-candy-framework/commerce-utils/selector';

/**
 * When server-side rendering, the getAssetFetcherData fetcher uses
 * this selector to get props needed for retrieving the asset.
 *
 * When client-side rendering, components can use this selector
 * as a "connect" component input in order to re-render if any of
 * those same props are changed.
 */
export const getAssetFetcherData = state => {
  const {pageId} = getPage(state);
  const {assetId} = getRequestContext(state);
  const assets = getAssets(state);
  const asset = assets[assetId];

  return {
    pageId,
    assetId,
    asset
  };
};

export default getAssetFetcherData;
