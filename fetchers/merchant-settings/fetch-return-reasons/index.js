/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
import {createFetcher} from '@sugar-candy-framework/fetchers/factory';
/**
 * Populates state with return reasons during component load
 */
export const fetcher = store => store.endpoint('getReturnReasons');

/*
 * Create `memoized` fetcher
 */
export default createFetcher(fetcher);
