/*
 ** Copyright (c) 2021 Oracle and/or its affiliates.
 */
import {fetchContentList} from '@sugar-candy-framework/fetchers/content-items/fetch-content-items';
import {useEffect} from 'react';

/**
 * A useEffect hook to use the fetchContentList fetcher during
 * client-side rendering.
 */
export const useFetchContentList = (store, props) => {
  const {id, queryBuilder, contentType, blockSize} = props;

  return useEffect(() => {
    fetchContentList(store, props);
  }, [id, queryBuilder, contentType, blockSize, store, props]);
};
