/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import {useEffect} from 'react';
import fetchCardTypes from '@sugar-candy-framework/fetchers/payments/fetch-card-types';
import {getCardTypes} from '@sugar-candy-framework/commerce-utils/selector';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';

/*
 * Hook for using fetchCardTypes fetcher
 */
export default store =>
  useEffect(() => {
    const cardTypes = getCardTypes(store.getState());

    if (isEmptyObject(cardTypes)) {
      // Fetch card types if not already present in the state
      fetchCardTypes(store);
    }
  }, [store]);
