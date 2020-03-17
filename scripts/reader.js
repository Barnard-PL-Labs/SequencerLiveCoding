
//-----
//
// Conenct devices and play a "connected" sound
//
// TODO: if no devices found, use virtual sequencer
//-----
WebMidi.enable(function (err) {
    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);
    var output = WebMidi.outputs[1];
    output.playNote("C5",1,{duration:100});
    output.playNote("E5",1,{duration:100});
    output.playNote("G5",1,{duration:100,time:"+100"});
}

//-----
//
// setup listener on input that will reconstruct pattern from sequencer
// TODO, with the right firmware, it should be possible to pull this off directly and remove this code
//
//-----
function startReader(){
    var input = WebMidi.inputs[1];
    
    var pattern = new Array(4*4); //beats * quantization level
 
    var queuedEvents = [];
    input.addListener('noteon', "all", function(e) {
       console.log("Pitch value: " + e.note.number);
       queuedEvents.push(e); 
    });

    function setHasNote(s, midiNote) {
      return Array.from(s.values()).some(m => m.note.number == midiNote.note.number && m.velocity == m.velocity);
    }

    // part of clock callback 
    // adds the note if we dont already have it
    function addToPattern(midiEvent, patternIndex) {
      thisBeat = pattern[patternIndex];
      midiNote = {note: midiEvent.note, channel:midiEvent.channel, velocity:midiEvent.velocity, rawVelocity: midiEvent.rawVelocity}
      if (thisBeat == undefined){
        pattern[patternIndex] = new Set([midiNote]);
      }
      else if (!setHasNote(thisBeat, midiNote)) {
        (pattern[patternIndex]).add(midiNote);
      }
      else {
      }
      //TODO send updated pattern to synthesis engine
    }

    var deltas = new Array(24*4); //24 clocks per quarter note, 4 beat patterns on circuit
    var last = 0
    var listening = false
    var patternIndex = 0
    var clockIndex = 0
    input.addListener('start', "all", function(e) {
       pattern = new Array(4*4); //reset notes on start
       listening = true
       patternIndex = 0
    });
    input.addListener('stop', "all", function(e) {
       listening = false
    });

    input.addListener('clock', "all", function(e) {
       clockIndex = (clockIndex+1) % 6 // 24clocks/quarter notes -> 6 clocks/sixteenth note
       if ( clockIndex == 3) { patternIndex += 1 } //when we are closer to next sixteen start saving notes in the next quantization
       patternIndex = patternIndex%16;
       queuedEvents.forEach(midiEvent => addToPattern(midiEvent,patternIndex));
       queuedEvents = []
       
    });

});

