import React from 'react';
import ReactDOMServer from 'react-dom/server';

const render = (renderFn, {components, state}) => {
  // Set flag that components are being rendered server-side, e.g. the Widget component needs to know this.
  components.ssr = true;

  /*
    Create a dummy store (this is sufficient for SSR).
    SSR is a single synchronous process that coverts the initial state (as provided by the data initializers) into html. State changes are not part of the SSR process and as such dispatching actions and listening for state changes is not required. What is required are that the basic store methods be defined and the getState method returns the initial state.
  */
  const store = {
    subscribe: () => {},
    dispatch: () => {},
    getState: () => state
  };

  // Pulling Root from the components parameter allows the Root to be overridden.
  const {Root} = components;

  return renderFn(<Root components={components} store={store} />);
};

/**
 * Render the application HTML to a Node Stream.
 *
 * @param {Object} props Object map of render params.
 * @param {Object} props.component The components available to the render function.
 * @param {Object} props.state The (initial) application state--this is a plain object, not a Store instance.
 * @return {Node.Stream} The state as a HTML document string.
 */
export const renderToNodeStream = options => render(ReactDOMServer.renderToNodeStream, options);

/**
 * Render the application HTML as a string.
 *
 * @param {Object} props Object map of render params.
 * @param {Object} props.component The components available to the render function.
 * @param {Object} props.state The (initial) application state--this is a plain object, not a Store instance.
 * @return {String} The state as a HTML document string.
 */
export const renderToString = options => render(ReactDOMServer.renderToString, options);
