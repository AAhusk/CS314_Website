import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App.js';

/* Calling render() will render the React element (App) into the DOM in the
 * supplied container [root] found in index.html. ReactDOM.render() controls the
 * contents of the container node you pass in. Any existing DOM elements inside
 * are replaced when first called.
 *
 * A link to ReactDOM's official documentation can be found at:
 * https://reactjs.org/docs/react-dom.html
 */

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

