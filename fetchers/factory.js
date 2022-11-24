/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

// TODO - move this to common utils
import {arraysEqual} from '@sugar-candy-framework/react-components/utils';

const defaultGetFetcherDependencies = () => [];

export const createFetcher = (fetcher, getFetcherDependencies = defaultGetFetcherDependencies, prefetch = []) => {
  const context = new WeakMap();

  return async store => {
    // Ensure context has been initialized for this store--one time only
    if (!context.has(store)) {
      context.set(store, {});
    }

    const storeContext = context.get(store);

    // Run pre-fetchers
    const prefetchResponses = await Promise.all(prefetch.map(fetcher => fetcher(store)));

    if (!fetcher) {
      let ok = true;

      for (const response of prefetchResponses) {
        ok = ok && response.ok;
      }

      // If no fetcher was declared then return the pre-fetch result only
      return {ok};
    }

    const currentDependencies = getFetcherDependencies(store.getState());

    // If the dependency values have changed recalculate the `memoized` state
    if (!arraysEqual(storeContext.previousDependencies, currentDependencies)) {
      storeContext.previousDependencies = currentDependencies;

      storeContext.memoizedState = fetcher(store);
    } else if (!((await storeContext.memoizedState) || {}).ok) {
      storeContext.memoizedState = fetcher(store);
    }

    return storeContext.memoizedState;
  };
};
