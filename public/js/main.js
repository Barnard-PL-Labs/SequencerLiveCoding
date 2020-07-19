const drums = require('./drummachine');
const code = require('./codeManager');

window.onload = function(){
  var cmInstance = code.bootCodeMirror();
  console.log(cmInstance)
  drums.initDrums(cmInstance);
}
