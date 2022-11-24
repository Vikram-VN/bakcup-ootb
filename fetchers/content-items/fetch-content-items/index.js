/*
 ** Copyright (c) 2021 Oracle and/or its affiliates.
 */

import {getContext, getCurrentPageId} from '@sugar-candy-framework/commerce-utils/selector';
import {getLanguage} from '@sugar-candy-framework/react-widgets/oce/utils';
import {getContentItem} from '@sugar-candy-framework/fetchers/content-items/fetch-current-content-item/selector';
import fetchSite from '@sugar-candy-framework/fetchers/site/fetch-site';

/**
 * Function to fetch missing data from content items returned by the fetchContentList function
 */
const fillFetchedContentItems = async (store, props, payload) => {
  delete payload.limit;
  delete payload.query;
  delete payload.offset;
  const contentItemList = getContentItem(store.getState(), {...props, widgetId: props.id});
  const contentItems = Object.keys(contentItemList);
  for (const id of contentItems) {
    payload.id = id;
    await store.endpoint('oceGetItem', payload);
  }
};

export const fetchContentList = async (store, props) => {
  const state = store.getState();
  const response = await fetchSite(store);
  if (response.ok !== true) {
    // If it fails return the failed response to notify the caller
    return response;
  }
  const pageId = getCurrentPageId(state);

  const {locale} = getContext(state).global;
  const language = getLanguage(locale);
  const pageLanguageQuery = ` AND language co "${language}"`;
  const additionalQueries = props.queryBuilder;
  let query = `(type eq "${props.contentType}"${pageLanguageQuery})`;
  let currentQuery, additional;
  if (additionalQueries && additionalQueries.queries && additionalQueries.queries.length) {
    const {andOr} = additionalQueries;
    for (const q of additionalQueries.queries) {
      currentQuery = `fields.${q.field} ${q.operator} "${q.value}"`;
      if (additional) {
        additional = `${additional} ${andOr} ${currentQuery}`;
      } else {
        additional = currentQuery;
      }
    }
    query = `(${query} AND (${additional}))`;
  }

  //get the content settings for the current site
  // create action payload
  const payload = {
    widgetId: props.id,
    query,
    limit: parseInt(props.blockSize, 10) || 16,
    pageId
  };

  await store.endpoint('oceGetItemsForDelivery', payload);

  await fillFetchedContentItems(store, props, payload);
};
