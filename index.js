#! /usr/bin/env node
var program = require('commander');
var branchLinker = require('./jira-branch-server-linker');


program
  .version('0.0.1')
  .option('-a, --add-branch-link <branchname>', 'Adds a branch link to a Jira issue', addBranchLink)
 program.parse(process.argv);

function addBranchLink(branchName) {
  console.log('add branch link with branch name ', branchName);
  branchLinker.addBranchLink(branchName);
}
