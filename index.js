#! /usr/bin/env node
/* process global */
var program = require('commander');
var branchLinker = require('./lib/jira-branch-server-linker');

/**
 * TODO Maybe add update config command
 */

program
  .version('0.0.1')
  .option('-a, --add-branch-link <branchUrl> <jiraIssueID>', 'Adds a branch link to a Jira issue', addBranchLink);
  
 program.parse(process.argv);

function addBranchLink(jiraIssueID, branchUrl) {
  // console.log('add branch from Jira ID ', jiraIssueID);
  // console.log('add branch link with branch url ', branchUrl);
  // console.log('program.args ', program);
  // console.log('issueID: ' + process.argv[3], ' branch link ', process.argv[4]);
  // node-jira -a https//:branchname.pacden.com BT-999
  branchLinker.addBranchLink(process.argv[3],  process.argv[4]);
}

// for testing ONLY!
//addBranchLink( process.argv[2]);