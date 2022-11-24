import {updateState} from '@sugar-candy-framework/utils/store';

/**
 *
 * @param {Response} response
 */
const isContentTypeJson = response => {
  const contentType = response.headers.get('Content-Type');

  if (contentType && contentType.includes('json')) {
    return true;
  }

  return false;
};

export const createStore = ({wapi, state}) => {
  return {
    getState() {
      return state;
    },

    async endpoint(name, payload) {
      const response = await wapi.endpoint(name, payload, state);

      const {ok, status, headers} = response;

      if (isContentTypeJson(response)) {
        const {error, json, ...delta} = await response.getJson();

        Object.assign(state, updateState(state, delta));

        return {ok, status, headers, json, delta, error};
      }

      const text = await response.text();

      return {ok, status, headers, text};
    },

    action() {
      throw new Error(
        'The method `store.action(...)` is not available on the server-side--please use `store.endpoint(...)` instead'
      );
    },

    subscribe() {
      throw new Error('The method `store.subscribe(...)` should not available on the server-side');
    },

    subscribeDispatch() {
      throw new Error('The method `store.subscribeDispatch(...)` should not available on the server-side');
    }
  };
};
