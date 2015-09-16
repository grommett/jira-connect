#! /usr/bin/env node
/* process global */
var program = require('commander');
var branchLinker = require('./jira-branch-server-linker');

/**
 * TODO Maybe add update config command
 */

program
  .version('0.0.1')
  .option('-a, --add-branch-link <branchname>', 'Adds a branch link to a Jira issue', addBranchLink)
 program.parse(process.argv);

function addBranchLink(branchName) {
  console.log('add branch link with branch name ', branchName);
  branchLinker.addBranchLink(branchName);
}
