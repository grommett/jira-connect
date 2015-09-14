#! /usr/bin/env node

var branchLinker = require('./jira-branch-server-linker');

branchLinker.addBranchLink('API-1');
console.log(process.argv);