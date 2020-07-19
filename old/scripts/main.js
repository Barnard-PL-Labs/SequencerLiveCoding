const reader = require('./reader');
const synthesizer = require('./synthesizer');
const synthEvent = require('./synthEvent');
const EventEmitter = require('events');

var myCodeMirror = CodeMirror.fromTextArea(codingWindow,
						{
								value: "function myScript(){return 100;}\n",
								lineNumbers: true, 
								mode:  "javascript"
						});

//-----
// Connect devices and play a "connected" sound
// TODO: if no devices found, use virtual sequencer
//-----
WebMidi.enable(function (err) {
    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);
    var deviceIndex = 0; //TODO allow user to select
    var output = WebMidi.outputs[deviceIndex];
    output.playNote("C5",1,{duration:100});
    output.playNote("E5",1,{duration:100});
    output.playNote("G5",1,{duration:100,time:"+100"});

    reader.startReader(deviceIndex);
});

synthEvent.newSynthEmit.on("synth", function(code) {
  myCodeMirror.setValue(code);
  console.log(code);
});
synthesizer.synth([]);
//synthEvent.newSynthEmit.emit("synth", "test");
