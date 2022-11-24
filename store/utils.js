import * as is from '@redux-saga/is';

import {call, cancel, cancelled, fork, getContext, put, select, spawn, take} from 'redux-saga/effects';

import {effectTypes} from '@redux-saga/core/effects';
import {measureTime} from '@sugar-candy-framework/utils/perf';
import {noop} from '@sugar-candy-framework/utils/generic';

export {takeEvery as subscribe} from 'redux-saga/effects';

export const ENDPOINT_REQUEST = 'endpointRequest';
export const ENDPOINT_RESOLVED = 'endpointResolved';
export const ENDPOINT_REJECTED = 'endpointRejected';
export const ENDPOINT_COMPLETE = 'endpointComplete';

export const createReducer =
  (handlers, initialState = {}) =>
  (state = initialState, action) => {
    return Object.prototype.hasOwnProperty.call(handlers, action.type) ? handlers[action.type](state, action) : state;
  };

export const combineReducers = reducers => {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};

  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  const finalReducerKeys = Object.keys(finalReducers);

  return (state = {}, action) => {
    let hasChanged = false;
    const nextState = {};

    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);

      console.assert(typeof nextStateForKey !== 'undefined', 'Reducer must not return "undefined".');

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? {...state, ...nextState} : state;
  };
};

/*
  Reduce multiple reducers into a single reducer from left to right.
 */
export const reduceReducers = reducers => (initialState, action) => {
  console.assert(Array.isArray(reducers), 'Array of reducers expected.');

  const result = reducers.reduce((intermediateState, reducer) => reducer(intermediateState, action), initialState);

  return result;
};

export const createSagaErrorHandler = ({store, wapi}) => {
  // Log unhandled api errors.
  return error => {
    const {getState = noop} = store;

    wapi.endpoint('logClientErrors', error, getState());

    console.warn(`[API] Error "${error.message}" has been logged with the CFW server`);
  };
};

export function* run(saga, action) {
  const {type, meta: {resolve = noop, reject = noop} = {}} = action;
  let task;
  let payload;
  try {
    task = yield spawn(saga, action);
    payload = yield task.toPromise();
    payload = payload || {ok: true};
    yield call(resolve, payload);
    yield put({type: `${type}Resolved`, payload, originalAction: action});
  } catch (payload) {
    yield call(reject, payload);
    yield put({type: `${type}Rejected`, payload, originalAction: action});
  } finally {
    if (yield cancelled() && task) {
      yield cancel(task);
    }
    yield put({type: `${type}Complete`, payload, originalAction: action});
  }
}

export const takeEvery = (patternOrChannel, saga) =>
  fork(function* () {
    while (true) {
      const action = yield take(patternOrChannel);
      yield fork(run, saga, action);
    }
  });

export const takeLatest = (patternOrChannel, saga) =>
  fork(function* () {
    let lastTask;
    while (true) {
      const action = yield take(patternOrChannel);
      if (lastTask) {
        yield cancel(lastTask);
      }
      lastTask = yield fork(run, saga, action);
    }
  });

export const takeLeading = (patternOrChannel, saga) =>
  fork(function* () {
    while (true) {
      const action = yield take(patternOrChannel);
      yield run(saga, action);
    }
  });

export const takeOnce = (patternOrChannel, saga) =>
  fork(function* () {
    const action = yield take(patternOrChannel);
    yield run(saga, action);
  });

export function* chain(action) {
  let reject, resolve;
  const actionPromise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  yield put({...action, meta: {...action.meta, resolve, reject}});

  return yield call(() => actionPromise);
}

export function* endpointSaga(action) {
  const {meta = {}} = action;

  const endpointId = action.endpointId || meta.endpointId || action.type;

  const originalType = action.type;

  __ENABLE_USER_TIMING_API__ && measureTime(`EndPointSaga-${endpointId}`).start();

  const {endpoint} = yield getContext('wapi') || {};

  console.assert(typeof endpoint === 'function', 'A reference to wapi must be passed in the action.');

  yield put({...action, endpointId, originalType, type: ENDPOINT_REQUEST});

  try {
    const response = yield call(endpoint, endpointId, action.payload, yield select());

    const {error, json, text, ...delta} = yield call(response.getJson);

    const {ok, status, url = '/candyWeb/'} = response;

    // false indicates this is an "internal" (occ) endpoint, true indicates it's an "external" (non-occ) endpoint
    const isExternalEndpoint = !url.includes('/candyWeb/');

    yield put({...action, ok, status, text, delta, error, endpointId, originalType, type: ENDPOINT_RESOLVED});

    if (ok !== true) {
      yield put({
        ...action,
        ok,
        status,
        text,
        delta,
        error,
        isExternalEndpoint,
        endpointId,
        originalType,
        type: `${status}`
      });
    }

    return {ok, status, json, text, delta, error};
  } catch (error) {
    yield put({...action, error, endpointId, originalType, type: ENDPOINT_REJECTED});
    throw error;
  } finally {
    yield put({...action, endpointId, originalType, type: ENDPOINT_COMPLETE});

    __ENABLE_USER_TIMING_API__ && measureTime(`EndPointSaga-${endpointId}`).stop();
  }
}

export const createSagaMonitor = () => {
  if (__ENABLE_USER_TIMING_API__) {
    const sagaEffects = {};

    const getSagaLabel = (effect, effectId) => {
      let label = `Cfw-Saga-Resolved-${effectId}`;
      let data = effect && effect.effect && is.effect(effect.effect) ? effect.effect : {};

      if (effect && effect.root) {
        data = effect.effect;
        label = 'Cfw-Saga-Resolved';
        if (data.saga && data.saga.name) {
          label = `${label}-${data.saga.name}`;
        }
      } else if (is.effect(data) && data.type === effectTypes.TAKE) {
        label = 'Cfw-Saga-Resolved-take';
        if (data.pattern) {
          label = `${label}-${data.pattern}`;
        }
      } else if (is.effect(data) && data.type === effectTypes.PUT) {
        label = 'Cfw-Saga-Resolved-put';
        if (data.action && data.action.type) {
          label = `${label}-${data.action.type}`;
        }
      } else if (is.effect(data) && data.type === effectTypes.CALL) {
        label = 'Cfw-Saga-Resolved-Call';
        if (data.fn && data.fn.name > 0) {
          label = `${label}-${data.fn.name[0]}`;
        }
        if (data.args && data.args.length > 0) {
          label = `${label}-${data.args[0]}`;
        }
      } else if (is.effect(data) && data.type === effectTypes.CPS) {
        label = 'Cfw-Saga-Resolved-cps';
        if (data.fn && data.fn.name > 0) {
          label = `${label}-${data.fn.name[0]}`;
        }
      } else if (is.effect(data) && data.type === effectTypes.FORK) {
        if (!data.detached) {
          label = 'Cfw-Saga-Resolved-fork';
        } else {
          label = 'Cfw-Saga-Resolved-spawn';
        }

        if (data.fn && data.fn.name > 0) {
          label = `${label}-${data.fn.name[0]}`;
        }
        if (data.args && data.args.length > 1) {
          label = `${label}-${data.args[0]}`;
        }
      } else if (is.effect(data) && data.type === effectTypes.JOIN) {
        label = 'Cfw-Saga-Resolved-join';
      } else if (is.effect(data) && data.type === effectTypes.RACE) {
        label = 'Cfw-Saga-Resolved-race';
      } else if (is.effect(data) && data.type === effectTypes.CANCEL) {
        label = 'Cfw-Saga-Resolved-cancel';
      } else if (is.effect(data) && data.type === effectTypes.SELECT) {
        label = 'Cfw-Saga-Resolved-select';
        if (data.selector && data.selector.name) {
          label = `${label}-${data.selector.name}`;
        }
      } else if (is.effect(data) && data.type === effectTypes.FLUSH) {
        label = 'Cfw-Saga-Resolved-flush';
      } else if (is.effect(data) && data.type === effectTypes.GET_CONTEXT) {
        label = 'Cfw-Saga-Resolved-get-context';
      } else if (is.effect(data) && data.type === effectTypes.SET_CONTEXT) {
        label = 'Cfw-Saga-Resolved-set-context';
      } else if (effect && effect.effect && is.array(effect.effect)) {
        label = 'Cfw-Saga-Resolved-parallel';
      } else if (effect && effect.effect && is.promise(effect.effect)) {
        label = 'Cfw-Saga-Resolved-promise';
      } else if (effect && effect.effect && is.iterator(effect.effect)) {
        label = 'Cfw-Saga-Resolved-iterator';
        if (effect.effect.name) {
          label = `${label}-${effect.effect.name}`;
        }
        if (effect.effect._result && effect.effect._result.action && effect.effect._result.action.type) {
          label = `${label}-${effect.effect._result.action.type}`;
        }
      }

      return label;
    };

    return {
      rootSagaStarted(options) {
        if (typeof performance !== 'undefined' && performance.mark) {
          performance.mark(`occ-saga-effect-${options.effectId}-start`);
        }
        sagaEffects[options.effectId] = options;
      },

      effectTriggered(options) {
        if (typeof performance !== 'undefined' && performance.mark) {
          performance.mark(`occ-saga-effect-${options.effectId}-start`);
        }
        sagaEffects[options.effectId] = options;
      },

      effectResolved(effectId) {
        const effect = sagaEffects[effectId];
        const label = getSagaLabel(effect, effectId);
        if (typeof performance !== 'undefined' && performance.mark && performance.getEntriesByName) {
          try {
            const effecList = performance.getEntriesByName(`occ-saga-effect-${effectId}-start`);
            if (effecList && effecList.length > 0) {
              performance.mark(`occ-saga-effect-${effectId}-end`);
              performance.measure(
                label ? label : effectId,
                `occ-saga-effect-${effectId}-start`,
                `occ-saga-effect-${effectId}-end`
              );
            }
          } catch (e) {
            console.log(e);
          }
        }
        delete sagaEffects[effectId];
      },

      effectRejected(effectId) {
        const effect = sagaEffects[effectId];
        const label = getSagaLabel(effect, effectId);
        if (typeof performance !== 'undefined' && performance.mark && performance.getEntriesByName) {
          try {
            const effecList = performance.getEntriesByName(`occ-saga-effect-${effectId}-start`);
            if (effecList && effecList.length > 0) {
              performance.mark(`occ-saga-effect-${effectId}-end`);
              performance.measure(
                label ? label : effectId,
                `occ-saga-effect-${effectId}-start`,
                `occ-saga-effect-${effectId}-end`
              );
            }
          } catch (e) {
            console.log(e);
          }
        }
        delete sagaEffects[effectId];
      },

      effectCancelled(effectId) {
        const effect = sagaEffects[effectId];
        const label = getSagaLabel(effect, effectId);
        if (typeof performance !== 'undefined' && performance.mark && performance.getEntriesByName) {
          try {
            const effecList = performance.getEntriesByName(`occ-saga-effect-${effectId}-start`);
            if (effecList && effecList.length > 0) {
              performance.mark(`occ-saga-effect-${effectId}-end`);
              performance.measure(
                label ? label : effectId,
                `occ-saga-effect-${effectId}-start`,
                `occ-saga-effect-${effectId}-end`
              );
            }
          } catch (e) {
            console.log(e);
          }
        }
        delete sagaEffects[effectId];
      }
    };
  }
};
