/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {fetchSearchResults} from '@sugar-candy-framework/fetchers/search';
import {getSearchResults} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';
import {useEffect} from 'react';

/**
 * A useEffect hook to use the fetchSearchResults fetcher during
 * client-side rendering.
 */
export const useSearchResultsFetcher = (store, {contextId, pageId, pageType, searchServicePath}) => {
  return useEffect(() => {
    if (isEmptyObject(getSearchResults(store.getState()))) {
      // Search result not loaded -- fetch them
      fetchSearchResults(store, {searchServicePath});
    } else {
      // Search results already loaded -- update search context to display them
      store.dispatch({type: 'updateState', delta: {candyRepository: {context: {request: {search: pageId}}}}});
    }
  }, [contextId, pageId, pageType, store, searchServicePath]);
};
