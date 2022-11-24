/*
 ** Copyright (c) 2021 Oracle and/or its affiliates.
 */

import {getContentItemsList, getContentWidgetItemIds} from '@sugar-candy-framework/commerce-utils/selector';

export const getContentItem = (state, props) => {
  const contentItemIds = getContentWidgetItemIds(state, props);

  if (contentItemIds && Object.keys(contentItemIds).length !== 0) {
    const contentItemList = getContentItemsList(state);
    const contentItemKeys = Object.keys(contentItemIds);
    const items = {};
    contentItemKeys.forEach(key => {
      items[key] = contentItemList[key];
    });

    return items;
  }

  return {};
};
