var color = require('colour');
var moduleName = 'Jira Connect >> ';

color.setTheme({
  info: 'green',
  warn: ['yellow', 'underline'],
  debug: 'blue',
  error: 'red bold'
});

function log(str) {
  console.log(moduleName + str +''.info);
}

function warn(str) {
  console.log(moduleName + str +''.warn);
}

function debug(str) {
  console.log(moduleName + str +''.debug);
}

function error(str) {
  console.log(moduleName + str +''.error);
}

module.exports ={
 log: log  
}