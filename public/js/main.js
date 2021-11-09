const init = require('./init');
const code = require('./codeManager');
const synth = require('./synthesis')
const handlers = require('./handlers')

window.onload = function(){
  var cmInstance = code.bootCodeMirror();
  synth.setCMInstance(cmInstance);
  handlers.setCMInstanceHandlers(cmInstance);
  init.initDrums(cmInstance);
}
