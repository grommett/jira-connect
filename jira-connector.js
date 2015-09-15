var superAgent = require('superagent');
var config = require('./config');

/**
 * Gets the connection type with defaults
 * @param {string} type - verb.
 * @param {string} url
*/
function getConnection(type, url) {
  switch(type) {
    case 'get':
      return getRequestDefaults(superAgent.get(url))
      break;
    case 'post':
      return getRequestDefaults(superAgent.post(url))
  }
}

/**
 * Adds default request headers
 */
 function getRequestDefaults(agent) {
   return agent
          .set(getRequestHeaders(config.user, config.password))
          .on('error', handleRequestError);
 }
 
/**
 * Base64 encodes user credentials.
 * @param {string} user - User name.
 * @param {string} pass - Password.
*/
function encodeCredentials(user, pass) {
  return 'Basic ' + new Buffer(user + ':' + pass).toString('base64');
}

/**
 * Request header factory.
 * @param {string} user - User name.
 * @param {string} pass - Password.
*/
function getRequestHeaders(user, pass) {
  return {
    'Authorization' : encodeCredentials(user, pass),
    'Content-Type' : 'application/json'
  }
}

/**
 * Request error handler.
 * @param {error} url - The link we want to add to the card.
*/
function handleRequestError(error) {
  console.log('Request Error: ', error);
}

/**
 * Wrapper for superagent->jira connections.
 * Adds default headers (content-type, and basic user auth)
 * @return {object} - a superagent object with user auth and content-type headers attached
*/
module.exports = {
    get: function(url) {
      return getConnection('get', url);
    },
    post: function(url) {
      return getConnection('post', url)
    }
  }