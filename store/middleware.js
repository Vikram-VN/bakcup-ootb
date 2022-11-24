import {getGlobalContext} from '@sugar-candy-framework/commerce-utils/selector';
import {measureTime} from '@sugar-candy-framework/utils/perf';
import {getSaveToLocalStorage} from '@sugar-candy-framework/store/selector';

const requestIdleCallback = self.requestIdleCallback || setTimeout;

/*
   Log middleware logs each action and current state to the console.
  */
export const createLogMiddleware = () => {
  // Create middleware
  const logMiddleware = store => next => action => {
    console.group(action.type);
    console.info('Dispatching', action);

    __ENABLE_USER_TIMING_API__ && measureTime(`Dispatch Action "${action.type}"`).start();

    // TODO do we still need this timing?
    const startTime = performance.now();

    // Pass action to next middleware or store.dispatch.
    const result = next(action);

    // TODO do we still need this timing?
    const duration = (performance.now() - startTime).toFixed(2);

    // Log next state after action is dispatched.
    console.log('Next State', store.getState());

    if (duration > 50) {
      console.warn(`Action "${action.type}" took ${duration}ms to complete (threshold = 50ms)`);
    }

    __ENABLE_USER_TIMING_API__ && measureTime(`Dispatch Action "${action.type}"`).stop();

    console.groupEnd(action.type);

    return result;
  };

  return logMiddleware;
};

/* global localStorage */

/*
   Create middleware to the state to local storage.
  */
export const createPersistenceMiddleware = initialState => {
  const {application} = getGlobalContext(initialState);
  const stateStorageKey = `${application}-state`;
  const savedState = JSON.parse(localStorage.getItem(stateStorageKey)) || {};

  let prevState;
  let count = 0;

  /*
     Persistence middleware saves the current state (after each action) to browser storage.
    */
  const persistenceMiddleware = store => {
    return next => action => {
      const result = next(action);

      // Persist state after action is dispatched.
      __ENABLE_USER_TIMING_API__ && measureTime('Save State to Browser Storage').start();

      const nextState = store.getState();

      if (nextState !== prevState) {
        prevState = nextState;

        localStorage.setItem(stateStorageKey, JSON.stringify(getSaveToLocalStorage(nextState)));

        __ENABLE_USER_TIMING_API__ && measureTime('Save State to Browser Storage').stop();

        console.debug('Storage write count =', ++count);
      }

      return result;
    };
  };

  // Put saved state onto middleware so the Store can be initialized with the saved state.
  persistenceMiddleware.savedState = savedState;

  return persistenceMiddleware;
};

/*
   The default Redux `subscribe` method notifies listeners of every state change. This middleware adds a `subscribeDispatch` method that notifies listeners of every action dispatch, e.g.:
 
   ```
   // Start listening
   const unsubscribe = store.subscribeDispatch(action => {
     const {type, ok, error} = action;
 
     if (type === 'loginResolved' && !ok) {
       // Handle login error
       alert(error.message);
     }
   });
 
   // Stop listening
   unsubscribe();
   ```
  */
export const createDisptachSubscriptionMiddleware = () => {
  const listeners = new Map();

  const subscribeDispatch = listener => {
    console.assert(typeof listener === 'function', 'Subsciption listener must be a function');

    if (!listeners.has(listener)) {
      listeners.set(listener, () => {
        if (listeners.has(listener)) {
          listeners.delete(listener);
        }
      });
    }

    return listeners.get(listener);
  };

  const middleware = store => next => action => {
    const result = next(action);
    const state = store.getState();

    // Notify listeners of each action dispatch--`requestIdleCallback` ensures that the listeners don't block the store actions (main thread) too much.
    requestIdleCallback(() => {
      for (const listener of listeners.keys()) {
        requestIdleCallback(() => listener(action, state));
      }
    });

    return result;
  };

  // Export `subscribeDispatch` method with middleware.
  middleware.subscribeDispatch = subscribeDispatch;

  return middleware;
};
