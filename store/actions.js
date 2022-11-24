import {
  ENDPOINT_COMPLETE,
  ENDPOINT_REQUEST,
  ENDPOINT_RESOLVED,
  combineReducers,
  createReducer,
  endpointSaga,
  reduceReducers,
  takeEvery
} from '@sugar-candy-framework/store/utils';

import {updateState} from '@sugar-candy-framework/utils/store';

const incrementInProgressStatus = (state, action, num = 1) => {
  const {endpointId} = action;
  const endpointStatus = state[endpointId] || {};
  const {inProgress = 0} = endpointStatus;

  return {
    ...state,
    [endpointId]: {
      ...endpointStatus,
      inProgress: inProgress + num
    }
  };
};

const updateStateReducer = (state, action) => {
  const updatedState = updateState(state, action.delta);

  return updatedState;
};

const endpointRequestReducer = (state, action) => incrementInProgressStatus(state, action);

const endpointCompleteReducer = (state, action) => incrementInProgressStatus(state, action, -1);

export default {
  reducer: reduceReducers([
    createReducer({
      [ENDPOINT_RESOLVED]: updateStateReducer,
      updateState: updateStateReducer
    }),
    combineReducers({
      candyRepository: combineReducers({
        endpointStatus: createReducer({
          [ENDPOINT_REQUEST]: endpointRequestReducer,
          [ENDPOINT_COMPLETE]: endpointCompleteReducer
        })
      })
    })
  ]),
  *saga() {
    yield takeEvery('endpoint', endpointSaga);
  }
};
