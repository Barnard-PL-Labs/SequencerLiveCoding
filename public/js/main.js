const init = require('./init');
const code = require('./codeManager');
const synth = require('./synthesis')

window.onload = function(){
  var cmInstance = code.bootCodeMirror();
  synth.setCMInstance(cmInstance);
  init.initDrums(cmInstance);
}
