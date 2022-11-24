import {getSessionContext} from '@sugar-candy-framework/commerce-utils/selector';

/**
 * Select state to save to local store (alias to override what is saved in local storage).
 *
 * @param {Object} state The current application state
 * @returns {Object} The subset of state to be saved in local storage
 */
export const getSaveToLocalStorage = state => {
  const session = getSessionContext(state);

  return {
    candyRepository: {
      context: {session}
    }
  };
};
