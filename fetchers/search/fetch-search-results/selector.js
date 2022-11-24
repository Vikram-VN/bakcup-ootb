/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getPage} from '@sugar-candy-framework/commerce-utils/selector';

/**
 * When server-side rendering, the fetchSearchResults fetcher uses
 * this selector to get props needed for retrieving the initial
 * search results.
 *
 * When client-side rendering, components can use this selector
 * as a "connect" component input in order to re-render if any of
 * those same props are changed.
 */
export const getSearchResultsFetcherData = state => {
  const {contextId, pageId, pageType} = getPage(state);

  return {
    contextId,
    pageId,
    pageType
  };
};
