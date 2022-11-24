import * as Redux from 'redux';

import {
  createDisptachSubscriptionMiddleware,
  createLogMiddleware,
  createPersistenceMiddleware
} from '@sugar-candy-framework/store/middleware';
import {createSagaErrorHandler, createSagaMonitor, reduceReducers} from '@sugar-candy-framework/store/utils';

import coreActions from '@sugar-candy-framework/store/actions';
import createSagaMiddleware from 'redux-saga';
import {identity} from '@sugar-candy-framework/utils/generic';
import {updateState} from '@sugar-candy-framework/utils/store';

export const createStore = ({actions = {}, state = {}, wapi, middleware = []}) => {
  // Store instance.
  const store = {};

  // Registry for reducers.
  const reducers = new Set();

  // Registry for sagas.
  const sagas = new Map();

  const loadActionEffectMiddleware = next => effect => {
    if (effect && effect.type === 'PUT') {
      /* eslint-disable no-use-before-define */
      loadAction(effect.payload.action.type).then(() => next(effect));
    } else {
      return next(effect);
    }
  };

  // Create Redux middleware.
  // Saga middleware implements all side effects, e.g. wapi calls.
  const sagaMiddleware = createSagaMiddleware({
    context: {wapi},
    effectMiddlewares: [loadActionEffectMiddleware],
    onError: createSagaErrorHandler({store, wapi}),
    sagaMonitor: createSagaMonitor()
  });

  // Persistence middleware saves the current state (after each action) to browser storage.
  const persistenceMiddleware = createPersistenceMiddleware(state);

  // Log middleware logs each action to the console.
  const logMiddleware = createLogMiddleware();

  // Topic subscription create an enhanced subscribe method that allows listeners to subscribe to specific topics.
  const dispatchSubscriptionMiddleware = createDisptachSubscriptionMiddleware();

  // The order of middleware is significant, don't change it!!!
  const enhancer = Redux.applyMiddleware(
    dispatchSubscriptionMiddleware,
    logMiddleware,
    persistenceMiddleware,
    // User supplied middleware here -->
    ...middleware,
    // <-- User supplied middleware here
    sagaMiddleware
  );

  const {subscribeDispatch} = dispatchSubscriptionMiddleware;

  const {savedState} = persistenceMiddleware;

  // If a saved state (from browser storage) exists, combine it with the initial state (from server).
  if (savedState != null) {
    state = updateState(savedState, state);
  }

  // Create redux store and get the store methods.
  const {dispatch, getState, replaceReducer, subscribe} = Redux.createStore(identity, state, enhancer);

  /*
    Compose all reducers to create a new application reducer that will replace the current application reducer. This is called when a new action is loaded, allowing dynamic injection of reducers.
   */
  const injectReducers = reducers => replaceReducer(reduceReducers(Array.from(reducers)));

  /*
    Start saga, if not already running.
   */
  const runSaga = (isRunning, saga, sagas) => {
    if (isRunning === false) {
      sagaMiddleware.run(saga);
      sagas.set(saga, true);
    }
  };

  /*
    Iterate over each saga in the sagas and if the saga is NOT already running, run it. This is called when a new action is loaded, allowing dynamic injection of sagas.
   */
  const injectSagas = sagas => sagas.forEach(runSaga);

  /*
    Called when a new action is loaded, to dynamically inject the new reducers and sagas.
   */
  const registerAction = ({reducer, saga}) => {
    if (typeof reducer === 'function' && !reducers.has(reducer)) {
      // Save reducer in registry.
      reducers.add(reducer);

      // Inject (new) reducer into store.
      injectReducers(reducers);
    }

    if (typeof saga === 'function' && !sagas.has(saga)) {
      // Save saga in registry--false indicates saga is not yet running.
      sagas.set(saga, false);

      // Inject new saga into store.
      injectSagas(sagas);
    }
  };

  /*
    Load an action.
   */
  const loadAction = async type => {
    const action = actions[type];

    if (action) {
      registerAction((await action()).default);
    }
  };

  /*
    Invoke a store action.
   */
  const action = (type, payload, meta) =>
    new Promise((resolve, reject) => {
      loadAction(type)
        .then(() => {
          dispatch({type, payload, meta: {...meta, resolve, reject}});
        })
        .catch(reject);
    });

  /*
    Helper method for invoking a store.action('endpoint', ...).
   */
  const endpoint = (endpointId, payload, meta) => action('endpoint', payload, {...meta, endpointId});

  // Register core actions.
  registerAction(coreActions);

  return Object.assign(store, {
    dispatch,
    action,
    endpoint,
    getState,
    subscribe,
    subscribeDispatch
  });
};
