/*
 ** Copyright (c) 2021 Oracle and/or its affiliates.
 */

import {getPage, getCurrentPageId} from '@sugar-candy-framework/commerce-utils/selector';
import {getContentItem} from '@sugar-candy-framework/fetchers/content-items/fetch-current-content-item/selector';
import fetchSite from '@sugar-candy-framework/fetchers/site/fetch-site';
import {fetchCurrentProductDetails} from '@sugar-candy-framework/fetchers/product';
import {isEmptyObject} from '@sugar-candy-framework/utils/generic';
import {ENDING_CEC_TAG, STARTING_CEC_TAG} from '@sugar-candy-framework/react-widgets/oce/utils';

/*
  Function to fetch all content items that match product query
  This function is needed as the product aware get item endpoint is a query on the
  `get items` endpoint and as such will need a subsequent call after to fetch the content
  item details
 */
const fetchProductAwareContent = async (store, payload, actionType) => {
  const getProdAwareContent = await store.endpoint(actionType, payload);
  payload.retrievedContent = true;
  payload.retrievedImage = false;

  return getProdAwareContent;
};

const fetchProductAwareImage = async (store, payload, props) => {
  /*
   * We need to make an additional call to retrieve the images as the product aware endpoint
   * does not provide the direct href. Without this an empty object would be returned
   */
  const state = store.getState();
  const contentItems = getContentItem(state, {...props, widgetId: props.id});
  const baseItem = Object.values(contentItems)[0];
  if (baseItem !== undefined) {
    const contentFields = baseItem.fields;
    for (const [key] of Object.entries(contentFields)) {
      if (payload.retrievedImage === false && contentFields[key].type === 'DigitalAsset') {
        payload.id = contentFields[key].id;
        payload.contentItemId = baseItem.id;
        payload.fieldName = key;
        /*
         * delete the product aware payload as this request goes to
         * the get item endpoint which retrieves the image
         */
        delete payload.productAware;
        delete payload.query;

        //we send the fetch to get the image and replace the product image object with the correct one
        return store.endpoint('oceGetItem', payload);
      }
    }
  }
};

/*
 * TODO figure out why store needs function to return value
 *  for value to be put in store
 */
const fetchRichTextAsset = async (store, payload) => {
  return store.endpoint('oceGetItem', payload);
};

/*
 * Fetcher to fetch the base content item and the content fields
 * If the content item contains rich text subsequent fetches will need to be dispatched
 * for each asset inside in each rich text field
 */
export const fetchBaseContentItem = async (store, props) => {
  const state = store.getState();
  // Call getSite fetcher
  const response = await fetchSite(store);
  if (response.ok !== true) {
    // If it fails return the failed response to notify the caller
    return response;
  }
  const pageId = getCurrentPageId(state);
  const payload = {
    widgetId: props.id,
    pageId
  };
  const {settings = {}} = props;
  const {type, productContentType, productField, assetId} = settings;
  const {cmsSlug, locale, contextId} = getPage(state);
  let actionType = 'oceGetItem';
  if (type === 'Product') {
    const productResponse = await fetchCurrentProductDetails(store);
    if (productResponse.ok !== true) {
      return productResponse;
    }
    const pageLanguageQuery = ` AND language co "${locale}"`;
    payload.productAware = true;
    payload.query = `?q=(type eq "${productContentType}" AND fields.${productField} eq "${contextId}"${pageLanguageQuery})`;
    payload.retrievedContent = false;
    await fetchProductAwareContent(store, payload, actionType);
    await fetchProductAwareImage(store, payload, props);
    payload.retrievedImage = true;
  } else if (type === 'Static') {
    const pageLanguageString = `/variations/language/${locale}`;
    payload.id = assetId;
    payload.paramRoute = pageLanguageString;
  } else if (settings.type === undefined || settings.type === 'Layout') {
    payload.slug = cmsSlug;
    actionType = 'oceGetItemBySlug';
  }
  if (type !== 'Product' && isEmptyObject(getContentItem(state, props))) {
    return store.endpoint(actionType, payload);
  }
};

/*
 * Fetcher to fetch the assets for each item for every rich text field
 */
export const fetchContentItem = async (store, props) => {
  // Call fetcher to get base content item
  await fetchBaseContentItem(store, props);

  const state = store.getState();
  const contentItems = getContentItem(state, {...props, widgetId: props.id});
  const baseItem = Object.values(contentItems)[0];
  if (baseItem !== undefined) {
    const contentFields = baseItem.fields;
    const pageId = getCurrentPageId(state);

    // Loop through text fields to find and fetch rich text assets
    for (const [key, value] of Object.entries(contentFields)) {
      // Loop through text fields to find and fetch rich text assets
      if (typeof value === 'string' && value.indexOf(STARTING_CEC_TAG) > -1) {
        const seenAssets = {},
          assetIds = [];
        let pos = 0;

        // get all the asset ids by tracking the position of the next starting tag in pos.
        // If pos != -1 process that asset id and move to the end of that tag and check again.
        while ((pos = value.indexOf(STARTING_CEC_TAG, pos)) !== -1) {
          const assetId = value.substring(pos + STARTING_CEC_TAG.length, value.indexOf(ENDING_CEC_TAG, pos));

          // if it is an asset id we haven't seen, track the asset id, build the HREF and track the promise to get the data
          if (!seenAssets[assetId]) {
            assetIds.push(assetId); // track the asset id
            seenAssets[assetId] = 1; // remember we have seen this asset
          }
          // move to the end of the current tag
          pos = value.indexOf(ENDING_CEC_TAG, pos) + ENDING_CEC_TAG.length;
        }

        // TODO may need to fetch item again with updated richText field
        for (const id of assetIds) {
          const payload = {
            id,
            richText: true,
            fieldName: key,
            contentItemId: baseItem.id,
            widgetId: props.id,
            pageId
          };

          await fetchRichTextAsset(store, payload);
        }
      }
    }

    return baseItem.id;
  }
};
