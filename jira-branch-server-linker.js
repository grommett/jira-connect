var request = require('request-promise');
var superAgent = require('superagent');
var q = require('q');
var branchName = 'https://pinkiering';
var config = require('./config');

/**
 * Adds a branch link to a Jira card.
 * @param {string} issueID - the issue id from Jira
*/
function addBranchLink(issueID) {
  var cardURL = config.jiraURL + '/rest/api/2/issue/' + issueID + '/remotelink';
  var branchLink = branchName + config.branchServer;
  var cardLinkData;

  getCardLinkData(cardURL)
    .then(function(data) {
      cardLinkData = linkInCard(branchLink, data);
      // check that link is not already in card
      if(cardLinkData.length === 0) {
        console.log('need to add link')
        putCardLinkData(cardURL, createCardLinkObject(cardURL))
        .then(function(data) {
          console.log('Jira branch linker >> Link added ('+ branchLink +'). ', data);
        })
      }else{
        console.log('Jira branch linker >> Link to branch server ('+ branchLink +') was already in card.');
      }
    })
    .catch(function(e) {
      console.log('Jira branch linker >> error in addBranchLink: ', e);
    })
}

/**
 * Gets the issue's link data from Jira.
 * @param {string} link - the issue id from Jira
*/
function getCardLinkData(link) {
  var deferred = q.defer();
  superAgent.get(link)
    .set(getRequestHeaders(config.user, config.password))
    .on('error', handleRequestError)
    .end(function(err, res) {
      if(err) deferred.reject(err);
      deferred.resolve(res.body)
    })
  return deferred.promise;
}

/**
 * Writes the issue's link data to Jira.
 * @param {string} link - the endpoint to the issue to call
 * @param {object} linkData - an object containing the data to write to the card's link property.
 * @return {promise}
*/
function putCardLinkData(link, linkData) {
  var deferred = q.defer();
  superAgent.post(link)
    .set(getRequestHeaders(config.user, config.password))
    .send(linkData)
    .on('error', handleRequestError)
    .end(function(err, res) {
      if(err) deferred.reject(err);
      deferred.resolve(res.body);
    })
  return deferred.promise;
}

/**
 * A link object factory.
 * @param {string} url - The link we want to add to the card.
 * @param {string} title - Optional. The title of the link.
 * @return {object} - The link object to send to Jira API.
*/
function createCardLinkObject(url, title) {
  return  {
    object: {
      title: title || 'Branch URL',
      url: branchName + config.branchServer
    }
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
 * Checks that the link we want to write is not already in the data.
 * @param {string} link - The link we want to check for.
 * @param {array} cardData - The card's data returned from Jira API.
*/
function linkInCard(link, cardData) {
  var linkArray = cardData.filter(function(item) {
    return item.object.url === link;
  })
  return linkArray;
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

module.exports = {
  addBranchLink: addBranchLink,
  confg: function(obj) {

  }
}