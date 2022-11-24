import {isObject} from '@sugar-candy-framework/utils/generic';

/*
  Takes the current state of an entity and a delta and returns the new state of the entity,
  i.e. a shallow merge of the current state and the delta.
 */
const updateEntity = (state, delta) => {
  if (state == null || delta === null) {
    return delta;
  }

  if (isObject(state) && isObject(delta)) {
    return {
      ...state,
      ...delta
    };
  }

  return state;
};

/*
    Takes the current state of a table and a delta and returns the new state of the table,
    i.e. invokes updateEntity for each entity in the table.
   */
const updateTable = (state, delta) => {
  if (state == null) {
    return delta;
  }

  if (delta == null) {
    return state;
  }

  const update = (entityState, id) => Object.assign(entityState, {[id]: updateEntity(state[id], delta[id])});

  return {
    ...state,
    ...Object.keys(delta).reduce(update, {})
  };
};

/*
    Takes the current state of a repository and a delta and returns the new state of the repository,
    i.e. invokes updateTable for each table in the repository.
   */
const updateRepository = (state, delta) => {
  if (state == null) {
    return delta;
  }

  if (delta == null) {
    return state;
  }

  const update = (entityState, id) => Object.assign(entityState, {[id]: updateTable(state[id], delta[id])});

  return {
    ...state,
    ...Object.keys(delta).reduce(update, {})
  };
};

/*
    Takes the current store state and a delta and returns the new state,
    i.e. invokes updateRepository for each repository in the state.
   */
export const updateState = (state, delta) => {
  if (delta == null) {
    return state;
  }

  const update = (entityState, id) => Object.assign(entityState, {[id]: updateRepository(state[id], delta[id])});

  return {
    ...state,
    ...Object.keys(delta).reduce(update, {})
  };
};
