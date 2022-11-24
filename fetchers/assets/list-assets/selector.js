/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getPage} from '@sugar-candy-framework/commerce-utils/selector';

/**
 * When server-side rendering, the getAssetsFetcherData fetcher uses
 * this selector to get props needed for retrieving the initial
 * assets list.
 *
 * When client-side rendering, components can use this selector
 * as a "connect" component input in order to re-render if any of
 * those same props are changed.
 */
export const getAssetsFetcherData = state => {
  const {pageId, items, hasMore, next} = getPage(state);

  return {
    pageId,
    items,
    hasMore,
    next
  };
};

export default getAssetsFetcherData;
