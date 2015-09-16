var superAgent = require('superagent');
var q = require('q');
var config = require('./config');
var connect = require('./jira-connector');

/**
 * Adds a branch link to a Jira card.
 * @param {string} issueID - the issue id from Jira
 * @export addBranchLink
*/
function addBranchLink(branchName) {
  
  var issueID = getIssueID(branchName);
  var cardURL = config.jiraURL + '/rest/api/2/issue/' + issueID + '/remotelink';
  var branchLink = slugify(branchName) + config.branchServer;
  var cardLinkData;

  getCardLinkData(cardURL)
    .then(function(data) {
      cardLinkData = linkInCard(branchLink, data);
      // check that link is not already in card
      if(cardLinkData.length === 0) {
        console.log('Jira branch linker >> need to add link');
        console.log('cardURL ', cardURL, ' branchLink: ', branchLink);
        putCardLinkData(cardURL, createCardLinkObject(branchLink))
        .then(function(data) {
          console.log('Jira branch linker >> Link added ('+ branchLink +'). ', data);
        })
        .catch(function(e) {
          // throw 
        })
      }else{
        console.log('Jira branch linker >> Link to branch server ('+ branchLink +') was already in card.');
      }
    })
    .catch(function(e) {
      // throw
      console.log('Jira branch linker >> error in addBranchLink(): ', e);
    })
}


/**
 * Add this to addBranchLink
 */
 function maybeAddCardLink (data) {
  // check that link is not already in card
  var cardLinkData = linkInCard(branchLink, data);

  if(cardLinkData.length === 0) {
    console.log('Jira branch linker >> need to add link')
    putCardLinkData(cardURL, createCardLinkObject(cardURL))
    .then(function(data) {
      console.log('Jira branch linker >> Link added ('+ branchLink +'). ', data);
    })
    .catch(function(e) {
      console.log('caught error ', e);
    })
  }else{
    console.log('Jira branch linker >> Link to branch server ('+ branchLink +') was already in card.');
  }
}

/**
 * Gets the issue's link data from Jira.
 * @param {string} link - the issue id from Jira
*/
function getCardLinkData(link) {
  var deferred = q.defer();
  connect.get(link)
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
  connect.post(link)
    .send(linkData)
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
  console.log('createCardLinkObject url: ', url)
  return  {
    object: {
      title: title || 'Branch URL',
      url:'https://' + url
    }
  }
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
 * Replaces '/' to '-' in the branch name as passed by Bamboo 
 * @param {string} branchName - The branch name as passed by Bamboo.
*/
function slugify(branchName) {
  return branchName.replace('/', '-');
}

/**
 * Returns the Jira id given a branch name
 * @param{string} str - The branch name
 */
function getIssueID(str) {
  var idMatches = str.match(/\/([A-Z].*?-[0-9].*?)-/);
  return idMatches[1];
}

module.exports = {
  addBranchLink: addBranchLink
}