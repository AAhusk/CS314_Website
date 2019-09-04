
/** This file is required to use fetch mocking to mock a REST response for client
 * testing. When mounting (either shallow or deep) components like Application,
 * a fetch is made through restfulAPI.js to get information from the server
 * (like the config) in order to render the component dynamically. However, in
 * the jest testing environment, asynchronous calls such as fetch need to be
 * mocked with a 'fake' response from the server.
 *
 * Documentation: https://www.npmjs.com/package/jest-fetch-mock
 */

global.fetch = require('jest-fetch-mock');

console.log = jest.fn(); // Subdue console logs in the testing environment.