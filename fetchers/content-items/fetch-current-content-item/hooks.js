/*
 ** Copyright (c) 2021 Oracle and/or its affiliates.
 */

import {fetchContentItem} from '@sugar-candy-framework/fetchers/content-items/fetch-current-content-item';
import {getPage} from '@sugar-candy-framework/commerce-utils/selector';
import {useSelector} from '@sugar-candy-framework/react-components/provider';
import {useEffect} from 'react';

/**
 * A useEffect hook to use the fetchContentItem fetcher during
 * client-side rendering.
 */
export const useFetchContentItem = (store, props) => {
  const {id, settings = {}} = props;
  const {type, productContentType, productField, assetId} = settings;
  const {cmsSlug, locale, contextId} = useSelector(getPage);

  return useEffect(() => {
    fetchContentItem(store, props);
  }, [id, cmsSlug, locale, contextId, type, productContentType, productField, assetId, store, props]);
};
