/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getCategories} from '@sugar-candy-framework/commerce-utils/selector';
import {getSearchResultsFetcherData} from '@sugar-candy-framework/fetchers/search/selectors';

/**
 * Fetcher that uses the "assemblerPages" endpoint to fetch search results.
 */
export const fetchSearchResults = async (store, {searchServicePath}) => {
  const {contextId, pageId, pageType} = getSearchResultsFetcherData(store.getState());
  const payload = {url: pageId, searchServicePath};

  /**
   * FIXME: TEMPORARY: If this fetcher is for a category page, look up the
   * dimension id for the category and add it to the payload. Ideally, GS would
   * be able to perform this mapping.
   */
  const isCategoryPage = pageType === 'category' || pageType === 'collection';
  const categoryId = isCategoryPage ? contextId : null;
  if (categoryId) {
    const response = await store.endpoint('getCollection', {categoryId});
    if (response.ok === true) {
      const state = response.delta;
      const category = getCategories(state)[categoryId];
      if (category && category.dimensionId) {
        payload.dimensionId = category.dimensionId;
      }
    }
  }

  return store.endpoint('search', payload);
};
