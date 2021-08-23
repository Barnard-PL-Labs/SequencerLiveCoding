function midiMessageReceived( ev ) {
    var cmd = ev.data[0] >> 4;
    var channel = ev.data[0] & 0xf;
    var noteNumber = ev.data[1];
    var velocity = 0;
    if (ev.data.length > 2)
      velocity = ev.data[2];

    if ( cmd==8 || ((cmd==9)&&(velocity==0)) ) { // with MIDI, note on with velocity zero is the same as note off
      // note off
      if (channel!=9)
        noteOff( noteNumber );
    } else if (cmd == 9) {
      // note on
      console.log("Note on - channel: " + channel + " note: " + noteNumber + " velocity: " + velocity );
      if ((channel == 9)||(channel==1))
        playDrum(noteNumber, velocity);
      else
        noteOn( noteNumber, velocity);
    } else if (cmd == 11) {
      console.log("controller: channel: " + channel + " controller: " + noteNumber + " value: " + velocity );
      controller( noteNumber, velocity);
    } else if ((ev.data.length == 6) &&
      (ev.data[0] == 0xf0) &&
      (ev.data[1] == 0x7f) &&
      (ev.data[3] == 0x06) &&
      (ev.data[5] == 0xf7) ) { // MIDI Machine Control (MMC) message
      switch (ev.data[4]) {
        case 0x01: // stop
          handleStop();
          break;
        case 0x02: // start
          handlePlay();
          break;
      }
    } else {
      console.log("unrecognized message");
    }
}

function nonControllrMidiMessageReceived( ev ) {
  var cmd = ev.data[0] >> 4;
  var channel = ev.data[0] & 0xf;
  var noteNumber = ev.data[1];
  var velocity = 0;
  if (ev.data.length > 2)
    velocity = ev.data[2];

  if ((cmd==9)&&(velocity!=0)) {
    // note on
    console.log("Note on - channel: " + channel + " note: " + noteNumber + " velocity: " + velocity );
    playDrum(noteNumber, velocity);
  }
}

var selectMIDIIn = null;
var selectMIDIOut = null;
var midiAccess = null;
var midiIn = null;
var midiOut = null;
var outputIsLivid = false;

function changeMIDIIn( ev ) {
  if (midiIn)
    midiIn.onmidimessage = null;
  var id = ev.target[ev.target.selectedIndex].value;
  if ((typeof(midiAccess.inputs) == "function"))   //Old Skool MIDI inputs() code
    midiIn = midiAccess.inputs()[ev.target.selectedIndex];
  else
    midiIn = midiAccess.inputs.get(id);
  if (midiIn)
    midiIn.onmidimessage = midiMessageReceived;
}

function changeMIDIOut( ev ) {
  var id = ev.target[ev.target.selectedIndex].value;

  if ((typeof(midiAccess.outputs) == "function"))   //Old Skool MIDI outputs() code
    midiOut = midiAccess.outputs()[ev.target.selectedIndex];
  else
    midiOut = midiAccess.outputs.get(id);

  outputIsLivid = midiOut.name.indexOf("Controls") != -1;
  if (outputIsLivid) {
    updateActiveInstruments();
    // light up the play button
    midiOut.send( [0x90, 3, 32] );
    // turn off the stop button
    midiOut.send( [0x80, 7, 1] );
  }
}

function onMIDIInit( midi ) {
  midiAccess = midi;
  selectMIDIIn=document.getElementById("midiIn");
  selectMIDIOut=document.getElementById("midiOut");
  
  // clear the MIDI input select
  selectMIDIIn.options.length = 0;
  selectMIDIOut.options.length = 0;

  if ((typeof(midiAccess.inputs) == "function")) {  //Old Skool MIDI inputs() code
    var list=midiAccess.inputs();

    for (var i=0; i<list.length; i++) {
      var str=list[i].name.toString();
      if (!midiIn && (str.indexOf("Controls") != -1)) {
        selectMIDIIn.appendChild(new Option(list[i].name,list[i].id,true,true));
        midiIn = list[i];
      } else
        selectMIDIIn.appendChild(new Option(list[i].name,list[i].id,false,false));
    }
    if (!midiIn)
      midiIn = list[0];
    if (midiIn)
      midiIn.onmidimessage = midiMessageReceived;

    list=midiAccess.outputs();

    for (var i=0; i<list.length; i++) {
      var str=list[i].name.toString();
      if (!midiOut && (str.indexOf("Controls") != -1)) {
        selectMIDIOut.appendChild(new Option(list[i].name,list[i].id,true,true));
        midiOut = list[i];
      } else
        selectMIDIOut.appendChild(new Option(list[i].name,list[i].id,false,false));
    }
    if (!midiOut)
      midiOut = list[0];
  } else {  // new MIDIMap implementation:
    var inputs=midiAccess.inputs.values();
    for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input = input.value;
      var str=input.name.toString();
      var preferred = !midiIn && (str.indexOf("Controls") != -1);

      selectMIDIIn.appendChild(new Option(input.name,input.id,preferred,preferred));
      if (preferred) {
        midiIn = input;
        midiIn.onmidimessage = midiMessageReceived;
      }
    }
    if (!midiIn) {
      midiIn = midiAccess.inputs.values().next().value;
      if (midiIn)
        midiIn.onmidimessage = midiMessageReceived;
    }

    var outputs=midiAccess.outputs.values();
    for ( var output = outputs.next(); output && !output.done; output = outputs.next()) {
      output = output.value;
      var str=output.name.toString();
      var preferred = !midiOut && (str.indexOf("Controls") != -1);

      selectMIDIOut.appendChild(new Option(output.name,output.id,preferred,preferred));
      if (preferred) {
        midiOut = output;
        outputIsLivid = true;
      }
    }
    if (!midiOut)
      midiOut = midiAccess.outputs.values().next().value;
  }
  selectMIDIIn.onchange = changeMIDIIn;
  selectMIDIOut.onchange = changeMIDIOut;
  
  setActiveInstrument( 0 );
  updateActiveInstruments();

  if (outputIsLivid) {
    // light up the play button
    midiOut.send( [0x90, 3, 32] );
    // turn off the stop button
    midiOut.send( [0x80, 7, 1] );
  }
}

function showBeat(index) {
  if (midiOut && outputIsLivid)
    midiOut.send( [0x90, 16 + index, ((index%4)==0) ? 0x03 : 0x07]);
}

function hideBeat(index) {
  if (midiOut && outputIsLivid)
    midiOut.send( [0x80, 16 + index, 0x00] );
}


function onMIDISystemError( msg ) {
  console.log( "Error encountered:" + msg );
}
//init: start up MIDI
window.addEventListener('load', function() {   
  navigator.requestMIDIAccess().then( onMIDIInit, onMIDISystemError );
});

var currentlyActiveInstrument = 0;

function keyForInstrument(index) {
    if (index <3)
      return index;
    else
      return index+1;
}

function colorForIntrument(index) {
  if (index<0 || index>6)
    return 0;

  if (index == 1)
    return 64;
  else
    return Math.pow(2,index);
}

var instrumentActive = [true,true,true,true,true,true];

function updateActiveInstruments() {
  if (!midiOut || !(outputIsLivid))
    return;

  for (var i=0;i<6; i++)
    if (instrumentActive[i])
      midiOut.send( [0x90, keyForInstrument(i)+8, colorForIntrument(i)] );
    else
      midiOut.send( [0x80, keyForInstrument(i)+8, 0x00] );
 }

function setActiveInstrument(index) {
  //console.log("midi beat", theBeat);
  //turn off the last lit-up instrument
  if (midiOut&&outputIsLivid)
    midiOut.send( [0x80, keyForInstrument(currentlyActiveInstrument), 0x00] );

  currentlyActiveInstrument = index;

  // turn on the new instrument button
  if (midiOut&&outputIsLivid)
    midiOut.send( [0x90, keyForInstrument(index), colorForIntrument(index)] );

  var notes = theBeat.track1vol;

  switch (currentlyActiveInstrument) {
      case 0: notes = theBeat.track1vol; break;
      case 1: notes = theBeat.track2vol; break;
      case 2: notes = theBeat.track3vol; break;
      case 3: notes = theBeat.track4vol; break;
      case 4: notes = theBeat.track5vol; break;
      case 5: notes = theBeat.track6vol; break;
  }

  for (var beat=0; beat<16; beat++)
    showCorrectNote( beat, notes[beat] );
}

function showCorrectNote( index, note ) {
  // note==0 -> off
  // note==1 -> light hit
  // note==2 -> loud hit

  if (midiOut && outputIsLivid)
    midiOut.send( [0x90, 32 + index, note * 32] );
}

function toggleBeat(trackIndex) {
    var notes = theBeat.track1vol;

    switch (currentlyActiveInstrument) {
        case 0: notes = theBeat.track1vol; break;
        case 1: notes = theBeat.track2vol; break;
        case 2: notes = theBeat.track3vol; break;
        case 3: notes = theBeat.track4vol; break;
        case 4: notes = theBeat.track5vol; break;
        case 5: notes = theBeat.track6vol; break;
    }

    notes[trackIndex] = (notes[trackIndex] + 1) % 3;

    drawNote(notes[trackIndex], trackIndex, currentlyActiveInstrument);

    showCorrectNote( trackIndex, notes[trackIndex] );

/* // not sure if we want to play notes when toggling on MIDI device
    var note = notes[trackIndex];
    
    if (note) {
        switch(instrumentIndex) {
        case 0:  // track6
          playNote(currentKit.track6Buffer, false, 0,0,-2, 0.5 * theBeat.effectMix, volumes[note] * 1.0, track6Pitch, 0);
          break;

        case 1:  // track5
          playNote(currentKit.track5Buffer, false, 0,0,-2, theBeat.effectMix, volumes[note] * 0.6, track5Pitch, 0);
          break;

        case 2:  // track4
          // Pan the track4 according to sequence position.
          playNote(currentKit.track4Buffer, true, 0.5*trackIndex - 4, 0, -1.0, theBeat.effectMix, volumes[note] * 0.7, track4Pitch, 0);
          break;

        case 3:  // Tom 1   
          playNote(currentKit.track1, false, 0,0,-2, theBeat.effectMix, volumes[note] * 0.6, track1Pitch, 0);
          break;

        case 4:  // track2   
          playNote(currentKit.track2, false, 0,0,-2, theBeat.effectMix, volumes[note] * 0.6, track2Pitch, 0);
          break;

        case 5:  // track3   
          playNote(currentKit.track3, false, 0,0,-2, theBeat.effectMix, volumes[note] * 0.6, track3Pitch, 0);
          break;
        }
    }
*/

}

function noteOn( noteNumber, velocity) {
  if (noteNumber < 16) {  // 4x4 grid
    switch (noteNumber) {
      case 0:
      case 1:
      case 2:
        setActiveInstrument( noteNumber );
        return;
      case 4:
      case 5:
      case 6:
        setActiveInstrument( noteNumber-1 );
        return;

      case 12:
      case 13:
      case 14:
        noteNumber--; // adjust number and fall through
      case 8:
      case 9:
      case 10:
        instrumentActive[noteNumber-8] = !instrumentActive[noteNumber-8];
        updateActiveInstruments();
        break;

      case 3:  // start playback
        handlePlay();
        return;
      case 7:  // stop playback
        handleStop();
        return;
    }
  } else if ((noteNumber>=32) && (noteNumber<48))  // bottom row - beats
    toggleBeat(noteNumber-32);
}

function noteOff( noteNumber ) {

}

var filterEngaged = false;

function controller(number, data) {
  switch (number) {
    case 1:
    case 4:  // Tempo
      theBeat.tempo = kMinTempo + data;
      document.getElementById('tempo').innerHTML = theBeat.tempo;
      return;
    case 8:  // Effect level
      sliderSetValue( 'effect_thumb', data/127);
      updateControls();
      return;
    case 12:  // track6 pitch
      sliderSetValue( 'track6_thumb', data/127);
      updateControls();
      return;
    case 16:  // track5 pitch
      sliderSetValue( 'track5_thumb', data/127);
      updateControls();
      return;
    case 20:  // track4 pitch
      sliderSetValue( 'track4_thumb', data/127);
      updateControls();
      return;
    case 24:  // track1 pitch
      sliderSetValue( 'track1_thumb', data/127);
      updateControls();
      return;
    case 28:  // track2 pitch
      sliderSetValue( 'track2_thumb', data/127);
      updateControls();
      return;
    case 32:  // track3 pitch
      sliderSetValue( 'track3_thumb', data/127);
      updateControls();
      return;

    case 2:
    case 48:  // Filter cutoff
      if ( !filterEngaged && data<127)
        return;
      filterEngaged = true;
      setFilterCutoff( data/127.0 );
      // echo back out - this lights up the control
      if (midiOut&&outputIsLivid)
        midiOut.send( [11<<4, 48, data] );
      return;

    case 3:
    case 51:  // Filter Q
      setFilterQ( data * 20.0/127.0 );
      // echo back out - this lights up the control
      if (midiOut&&outputIsLivid)
        midiOut.send( [11<<4, 48, data] );
      return;

  }
}