/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */
/**
 * Module returns product information along with productType information for the current page
 * and transforms that information into the state model
 * required by the client.
 *
 * @module @sugar-candy-framework/initializers/content
 */
export const getContent = {
  /**
   * function retrieves the product and productType information for the current page.
   *
   * @param {Object} the page response for the current page.
   * @returns {Promise} a promise to be resolved with the retrieved product information.
   */
  async getData() {
    return {
      ok: true
    };
  },

  /**
   * function returns the state model with the current product information
   * added to it.
   *
   * @param {Object} response the product information to be added to the state model.
   * @param {Object} page the current page response.
   * @returns {Object} the current state model with the transformed product information added to it.
   */
  transformData(response, req, res) {
    const {page} = res.locals;

    return {
      candyRepository: {
        context: {
          request: {
            contentId: page.context.contextId
          }
        }
      }
    };
  }
};
