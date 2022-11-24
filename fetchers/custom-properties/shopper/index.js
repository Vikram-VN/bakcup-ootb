/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {createFetcher} from '@sugar-candy-framework/fetchers/factory';

/*
 * Function to make the endpoints call(s).
 *
 * Unsuccessful fetcher calls should not be `memoized`. Return the (significant) response object
 * from the fetcher so the memoizer can determine if the execution was successful, i.e. `response.ok`.
 *
 * Populates state with shopper custom properties during server-side rendering
 */
export const fetcher = store => store.endpoint('getUserCustomProperties');

/*
 * Create `memoized` fetcher
 */
export default createFetcher(fetcher);
