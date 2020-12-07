const init = require('./init');
const code = require('./codeManager');

window.onload = function(){
  var cmInstance = code.bootCodeMirror();
  console.log(cmInstance)
  init.initDrums(cmInstance);
}
