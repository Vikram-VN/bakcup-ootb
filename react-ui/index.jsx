import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Initialize the UI and render the store's state into the container element. The
 * UI will then listen for state changes in the store and re-render as required.
 *
 * @param {Object} props Object map of render params.
 * @param {Object} props.component The components available to the render function.
 * @param {occ.Store} props.store The store object manages the application state. It notifies
 * observers of state change and provides "actions" that can trigger state change and/or
 * side effects.
 * @param {Element} props.container The DOM element into which the UI will be rendered.
 */
export const render = ({components = {}, store, container}) => {
  // Determine if the document has been rendered server side, if so hydrate.
  const render = container.childElementCount ? ReactDOM.hydrate : ReactDOM.render;

  // Pulling Root from the components parameter allows the Root to be overridden.
  const {Root} = components;

  console.assert(typeof Root, 'Missing Root components');

  render(<Root components={components} store={store} />, container);
};
