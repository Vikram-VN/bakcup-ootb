/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {getPage} from '@sugar-candy-framework/commerce-utils/selector';
import {createFetcher} from '@sugar-candy-framework/fetchers/factory';

/*
 * Function to make the endpoints call(s).
 *
 * Unsuccessful fetcher calls should not be `memoized`. Return the (significant) response object
 * from the fetcher so the memoizer can determine if the execution was successful, i.e. `response.ok`.
 */
export const fetcher = store => store.endpoint('getSite');

/*
 * Executing fetcher functions is expensive. To ensure fetchers are not executed unnecessarily
 * their results are `memoized`. The `memoized` values are recomputed ONLY when a value in the
 * specified dependency array changes. To specify the dependencies you must provide a selector
 * that returns an array of values from the state. The `getDependencies` selector must ALWAYS
 * return dependency values in the same order--so they can be compared to the previous dependencies.
 * Providing no `getDependencies` selector will cause the fetcher to run ONE TIME ONLY--as there
 * are no dependencies to trigger recomputation.
 */
export const getDependencies = state => [getPage(state).siteId];

/*
 * Create `memoized` fetcher
 */
export default createFetcher(fetcher, getDependencies);
