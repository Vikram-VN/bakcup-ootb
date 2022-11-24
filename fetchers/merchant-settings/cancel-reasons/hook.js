/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import fetchCancelReasons from '@sugar-candy-framework/fetchers/merchant-settings/cancel-reasons';
import {getCancelReasons} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';

/*
 * Hook for using fetchCancelReasons fetcher
 */
export default store =>
  useEffect(() => {
    const cancelReasons = getCancelReasons(store.getState());

    // TODO - should this check be done in the fetcher?
    // Detects if the cancelReasons was populated in the state during server-side rendering
    if (isEmptyObject(cancelReasons)) {
      fetchCancelReasons(store);
    }
  }, [store]);
