/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import fetchCommonResources from '@sugar-candy-framework/fetchers/resources/common-resources';
import {getCommonResources} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';

/*
 * Hook for using fetchCommonResources fetcher
 */
export default store =>
  useEffect(() => {
    const resources = getCommonResources(store.getState());

    //  if the resources are populated in the state during server-side rendering
    if (isEmptyObject(resources)) {
      fetchCommonResources(store);
    }
  }, [store]);
