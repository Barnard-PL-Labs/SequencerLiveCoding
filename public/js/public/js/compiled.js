(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

var kMinTempo = 53;
var kMaxTempo = 180;

var kMaxSwing = .08;

var startTime;

function setStartTime (t) {
  startTime = t;
  exports.startTime = startTime;
}


var loopLength = 16;
var trackIndex = 0;

function settrackIndex(idx) {
    trackIndex = idx;
    exports.trackIndex = trackIndex;
}

var beatReset = {"kitIndex":0,"effectIndex":0,"tempo":100,"swingFactor":0,"effectMix":0.25,"track6PitchVal":0.5,"track5PitchVal":0.5,"track4PitchVal":0.5,"track1PitchVal":0.5,"track2PitchVal":0.5,"track3PitchVal":0.5,"track1vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track2vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track3vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track4vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track5vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track6vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};
var beatDemo = [
    {"kitIndex":13,"effectIndex":18,"tempo":120,"swingFactor":0,"effectMix":0.19718309859154926,"track6PitchVal":0.5,"track5PitchVal":0.5,"track4PitchVal":0.5,"track1PitchVal":0.5,"track2PitchVal":0.5,"track3PitchVal":0.5,"track1vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track2vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track3vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track4vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track5vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track6vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
    {"kitIndex":4,"effectIndex":12,"tempo":100,"swingFactor":0,"effectMix":0.2,"track6PitchVal":0.46478873239436624,"track5PitchVal":0.45070422535211263,"track4PitchVal":0.15492957746478875,"track1PitchVal":0.7183098591549295,"track2PitchVal":0.704225352112676,"track3PitchVal":0.8028169014084507,"track1vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track2vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track3vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track4vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track5vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track6vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
    {"kitIndex":2,"effectIndex":5,"tempo":100,"swingFactor":0,"effectMix":0.25,"track6PitchVal":0.5,"track5PitchVal":0.5,"track4PitchVal":0.5211267605633803,"track1PitchVal":0.23943661971830987,"track2PitchVal":0.21126760563380287,"track3PitchVal":0.2535211267605634,"track1vol":[2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0],"track2vol":[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0],"track3vol":[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],"track4vol":[1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],"track5vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],"track6vol":[0,0,1,0,1,0,0,2,0,2,0,0,1,0,0,0]},
    {"kitIndex":1,"effectIndex":4,"tempo":120,"swingFactor":0,"effectMix":0.25,"track6PitchVal":0.7887323943661972,"track5PitchVal":0.49295774647887325,"track4PitchVal":0.5,"track1PitchVal":0.323943661971831,"track2PitchVal":0.3943661971830986,"track3PitchVal":0.323943661971831,"track1vol":[2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1],"track2vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track3vol":[0,0,1,0,2,0,1,0,1,0,1,0,2,0,2,0],"track4vol":[2,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0],"track5vol":[0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],"track6vol":[0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0]},
    {"kitIndex":0,"effectIndex":1,"tempo":60,"swingFactor":0.5419847328244275,"effectMix":0.25,"track6PitchVal":0.5,"track5PitchVal":0.5,"track4PitchVal":0.5,"track1PitchVal":0.5,"track2PitchVal":0.5,"track3PitchVal":0.5,"track1vol":[2,2,0,1,2,2,0,1,2,2,0,1,2,2,0,1],"track2vol":[0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],"track3vol":[2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1],"track4vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"track5vol":[0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0],"track6vol":[1,0,0,1,0,1,0,1,1,0,0,1,1,1,1,0]},
];


function cloneBeat(source) {
    var beat = new Object();

    beat.kitIndex = source.kitIndex;
    beat.effectIndex = source.effectIndex;
    beat.tempo = source.tempo;
    beat.swingFactor = source.swingFactor;
    beat.effectMix = source.effectMix;
    beat.track6PitchVal = source.track6PitchVal;
    beat.track5PitchVal = source.track5PitchVal;
    beat.track4PitchVal = source.track4PitchVal;
    beat.track1PitchVal = source.track1PitchVal;
    beat.track2PitchVal = source.track2PitchVal;
    beat.track3PitchVal = source.track3PitchVal;
    beat.track1vol = source.track1vol.slice(0);        // slice(0) is an easy way to copy the full array
    beat.track2vol = source.track2vol.slice(0);
    beat.track3vol = source.track3vol.slice(0);
    beat.track4vol = source.track4vol.slice(0);
    beat.track5vol = source.track5vol.slice(0);
    beat.track6vol = source.track6vol.slice(0);

    return beat;
}

// theBeat is the object representing the current beat/groove
// ... it is saved/loaded via JSON
var theBeat = cloneBeat(beatReset);

function setBeat(newBeat) {
    theBeat = newBeat;
    exports.theBeat = theBeat;
}

function setBeatEffectMix(value) {
    theBeat.effectMix = value;
    exports.theBeat = theBeat
}

function setBeattrack6PitchVal(value) {
    theBeat.track6PitchVal = value;
    exports.theBeat = theBeat
}

function setBeattrack5PitchVal(value) {
    theBeat.track5PitchVal = value;
    exports.theBeat = theBeat
}

function setBeattrack4PitchVal(value) {
    theBeat.track4PitchVal = value;
    exports.theBeat = theBeat
}

function setBeattrack1PitchVal(value) {
    theBeat.track1PitchVal = value;
    exports.theBeat = theBeat
}

function setBeattrack2PitchVal(value) {
    theBeat.track2PitchVal = value;
    exports.theBeat = theBeat
}

function setBeattrack3PitchVal(value) {
    theBeat.track3PitchVal = value;
    exports.theBeat = theBeat
}

function setBeatSwingFactor(value) {
    theBeat.swingFactor = value;
    exports.theBeat = theBeat
}

function setBeatKitIndex(index){
    theBeat.kitIndex = index;
    exports.theBeat = theBeat
}

function setBeatEffectIndex(index){
    theBeat.effectIndex = index;
    exports.theBeat = theBeat
}





function tempoIncrease() {
    theBeat.tempo = Math.min(kMaxTempo, theBeat.tempo+4);
    document.getElementById('tempo').innerHTML = theBeat.tempo;
    exports.theBeat = theBeat
}

function tempoDecrease() {
    theBeat.tempo = Math.max(kMinTempo, theBeat.tempo-4);
    document.getElementById('tempo').innerHTML = theBeat.tempo;
    exports.theBeat = theBeat
}


// functions
exports.setBeat = setBeat;

exports.setBeatEffectMix = setBeatEffectMix;
exports.setBeattrack6PitchVal = setBeattrack6PitchVal;
exports.setBeattrack5PitchVal = setBeattrack5PitchVal;
exports.setBeattrack4PitchVal = setBeattrack4PitchVal;
exports.setBeattrack1PitchVal = setBeattrack1PitchVal;
exports.setBeattrack2PitchVal = setBeattrack2PitchVal;
exports.setBeattrack3PitchVal = setBeattrack3PitchVal;
exports.setBeatSwingFactor = setBeatSwingFactor;

exports.setBeatKitIndex = setBeatKitIndex;
exports.setBeatEffectIndex = setBeatEffectIndex;
exports.settrackIndex = settrackIndex;
exports.setStartTime = setStartTime;

exports.cloneBeat = cloneBeat;
exports.tempoIncrease = tempoIncrease;
exports.tempoDecrease = tempoDecrease;

// variables
exports.theBeat = theBeat;
exports.beatReset = beatReset;
exports.beatDemo = beatDemo;
exports.loopLength = loopLength;
exports.trackIndex = trackIndex;
exports.kMaxSwing = kMaxSwing;

},{}],2:[function(require,module,exports){


exports.bootCodeMirror = function() {

    var myCodeMirror = CodeMirror.fromTextArea( document.getElementById("codingWindow"),
		{
		lineNumbers: true, 
		mode:  "javascript"
		});
	//TODO fix function header and return statement outside code window so user cannot change it, but still sees it
	myCodeMirror.setValue('function genBeat(b, currentTimestep){\n\n  return b;\n};');
    return myCodeMirror;	
};




},{}],3:[function(require,module,exports){
const beatMod = require('./beat')

var context;
var convolver;
var compressor;
var masterGainNode;
var effectLevelNode;
var filterNode;


// Each effect impulse response has a specific overall desired dry and wet volume.
// For example in the telephone filter, it's necessary to make the dry volume 0 to correctly hear the effect.
var effectDryMix = 1.0;
var effectWetMix = 1.0;

function setEffectDryMix(m) {
  effectDryMix = m;
  exports.effectDryMix = effectDryMix;
}

function setEffectWetMix(m) {
  effectWetMix = m;
  exports.effectWetMix = effectWetMix;
}


function setContext (c) {
  context = c;
  exports.context = context;
}

function setConvolver (n) {
  convolver = n;
  exports.convolver = convolver;
}

function setCompressor (n) {
  compressor = n;
  exports.compressor = compressor;
}

function setMasterGainNode (n) {
  masterGainNode = n;
  exports.masterGainNode = masterGainNode;
}

function setEffectLevelNode (n) {
  effectLevelNode = n;
  exports.effectLevelNode = effectLevelNode;
}

function setFilterNode (n) {
  filterNode = n;
  exports.filterNode = filterNode;
}

function filterFrequencyFromCutoff( cutoff ) {
    var nyquist = 0.5 * context.sampleRate;

    // spreads over a ~ten-octave range, from 20Hz - 20kHz.
    var filterFrequency = Math.pow(2, (11 * cutoff)) * 40;

    if (filterFrequency > nyquist)
        filterFrequency = nyquist;
    return filterFrequency;
}

function setFilterCutoff( cutoff ) {
    if (filterNode){
        filterNode.frequency.value = filterFrequencyFromCutoff( cutoff );
        exports.filterNode = filterNode;
    }
}

function setFilterQ( Q ) {
    if (filterNode){
        filterNode.Q.value = Q;
        exports.filterNode = filterNode;
    }
}


function setEffectLevel() {
    // Factor in both the preset's effect level and the blending level (effectWetMix) stored in the effect itself.
    effectLevelNode.gain.value = beatMod.theBeat.effectMix * effectWetMix;
    exports.effectLevelNode = effectLevelNode;
}

function setConvolverBuffer (b) {
  convolver.buffer = b;
  exports.convolver = convolver;
}

function connectNodes(n1, n2) {
  n1.connect(n2);

  // This is probably an ugly way to do it, I just want to be
  // everything is covered
  exports.context = context;
  exports.convolver = convolver;
  exports.compressor = compressor;
  exports.masterGainNode = masterGainNode;
  exports.effectLevelNode = effectLevelNode;
  exports.filterNode = filterNode;
}





// functions

exports.setContext = setContext;
exports.setConvolver = setConvolver;
exports.setCompressor = setCompressor;
exports.setMasterGainNode = setMasterGainNode;
exports.setEffectLevelNode = setEffectLevelNode;
exports.setFilterNode = setFilterNode;

exports.filterFrequencyFromCutoff = filterFrequencyFromCutoff;
exports.setFilterCutoff = setFilterCutoff;
exports.setFilterQ = setFilterQ;

exports.setEffectDryMix = setEffectDryMix;
exports.setEffectWetMix = setEffectWetMix;
exports.setEffectLevel = setEffectLevel;
exports.setConvolverBuffer = setConvolverBuffer;


exports.connectNodes = connectNodes;






// variables
exports.context = context;
exports.convolver = convolver;
exports.compressor = compressor;
exports.masterGainNode = masterGainNode;
exports.effectLevelNode = effectLevelNode;
exports.filterNode = filterNode;

exports.effectDryMix = effectDryMix;
exports.effectWetMix = effectWetMix;







//

},{"./beat":1}],4:[function(require,module,exports){
const beatMod = require('./beat')
const kitMod = require('./kit')
const impulseMod = require('./impulse')



var lastDrawTime = -1;

function setLastDrawTime(time) {
    lastDrawTime = time;
    exports.lastDrawTime = lastDrawTime
}


function drawNote(draw, xindex, yindex) {
    var elButton = document.getElementById(kitMod.instruments[yindex] + '_' + xindex);
    switch (draw) {
        case 0: elButton.src = 'images/button_off.png'; break;
        case 1: elButton.src = 'images/button_half.png'; break;
        case 2: elButton.src = 'images/button_on.png'; break;
    }
}

function redrawAllNotes() {
    for (y = 0; y < 6; y++) { //6 track patterns in theBeat
        for (x = 0; x < 16; x++)  { //16 beat subdivisions
            if(x >= beatMod.theBeat['track'+(y+1).toString()].length){
                drawNote(0, x, y);
            }
            else {
                drawNote(beatMod.theBeat['track'+(y+1).toString()][x], x, y);
            }
        }
    }
}

function drawPlayhead(xindex) {
    var lastIndex = (xindex + 15) % 16;

    var elNew = document.getElementById('LED_' + xindex);
    var elOld = document.getElementById('LED_' + lastIndex);

    elNew.src = 'images/LED_on.png';
    elOld.src = 'images/LED_off.png';

    hideBeat( lastIndex );
    showBeat( xindex );
}

function sliderSetPosition(slider, value) {
    var elThumb = document.getElementById(slider);
    var elTrack = elThumb.parentNode;

    if (slider == 'swing_thumb') {
        var thumbW = elThumb.clientWidth;
        var trackW = elTrack.clientWidth;
        var travelW = trackW - thumbW;

        elThumb.style.left = travelW * value + 'px';
    } else {
        var thumbH = elThumb.clientHeight;
        var trackH = elTrack.clientHeight;
        var travelH = trackH - thumbH;

        elThumb.style.top = travelH * (1.0 - value) + 'px';
    }
}

function updateControls() {
    for (i = 0; i < beatMod.loopLength; ++i) {
        for (j = 0; j < kitMod.kNumInstruments; j++) {
            switch (j) {
                case 0: notes = beatMod.theBeat.track1vol; break;
                case 1: notes = beatMod.theBeat.track2vol; break;
                case 2: notes = beatMod.theBeat.track3vol; break;
                case 3: notes = beatMod.theBeat.track4vol; break;
                case 4: notes = beatMod.theBeat.track5vol; break;
                case 5: notes = beatMod.theBeat.track6vol; break;
            }

            drawNote(notes[i], i, j);
        }
    }

    document.getElementById('kitname').innerHTML = kitMod.kitNamePretty[beatMod.theBeat.kitIndex];
    document.getElementById('effectname').innerHTML = impulseMod.impulseResponseInfoList[beatMod.theBeat.effectIndex].name;
    document.getElementById('tempo').innerHTML = beatMod.theBeat.tempo;
    sliderSetPosition('swing_thumb', beatMod.theBeat.swingFactor);
    sliderSetPosition('effect_thumb', beatMod.theBeat.effectMix);
    sliderSetPosition('track6_thumb', beatMod.theBeat.track6PitchVal);
    sliderSetPosition('track5_thumb', beatMod.theBeat.track5PitchVal);
    sliderSetPosition('track4_thumb', beatMod.theBeat.track4PitchVal);
    sliderSetPosition('track1_thumb', beatMod.theBeat.track1PitchVal);
    sliderSetPosition('track2_thumb', beatMod.theBeat.track2PitchVal);
    sliderSetPosition('track3_thumb', beatMod.theBeat.track3PitchVal);
}


// functions
exports.drawNote = drawNote;
exports.redrawAllNotes = redrawAllNotes;
exports.drawPlayhead = drawPlayhead;
exports.setLastDrawTime = setLastDrawTime;
exports.sliderSetPosition = sliderSetPosition;
exports.updateControls = updateControls;

// variables
exports.lastDrawTime = lastDrawTime;


//

},{"./beat":1,"./impulse":6,"./kit":8}],5:[function(require,module,exports){
const beatMod = require('./beat')
const kitMod = require('./kit')
const drawMod = require('./draw')
const synthMod = require('./synthesis')
const impulseMod = require('./impulse')
const playMod = require('./play')
const slidersMod = require('./sliders')
const contextMod = require('./context')


var mouseCapture = null;
var mouseCaptureOffset = 0;

function handleSliderMouseDown(event) {
    mouseCapture = event.target.id;

    // calculate offset of mousedown on slider
    var el = event.target;
    if (mouseCapture == 'swing_thumb') {
        var thumbX = 0;
        do {
            thumbX += el.offsetLeft;
        } while (el = el.offsetParent);

        mouseCaptureOffset = event.pageX - thumbX;
    } else {
        var thumbY = 0;
        do {
            thumbY += el.offsetTop;
        } while (el = el.offsetParent);

        mouseCaptureOffset = event.pageY - thumbY;
    }
}

function handleSliderDoubleClick(event) {
    var id = event.target.id;
    if (id != 'swing_thumb' && id != 'effect_thumb') {
        mouseCapture = null;
        slidersMod.sliderSetValue(event.target.id, 0.5);
        drawMod.updateControls();
    }
}

function handleMouseMove(event) {
    if (!mouseCapture) return;

    var elThumb = document.getElementById(mouseCapture);
    var elTrack = elThumb.parentNode;

    if (mouseCapture != 'swing_thumb') {
        var thumbH = elThumb.clientHeight;
        var trackH = elTrack.clientHeight;
        var travelH = trackH - thumbH;

        var trackY = 0;
        var el = elTrack;
        do {
            trackY += el.offsetTop;
        } while (el = el.offsetParent);

        var offsetY = Math.max(0, Math.min(travelH, event.pageY - mouseCaptureOffset - trackY));
        var value = 1.0 - offsetY / travelH;
        elThumb.style.top = travelH * (1.0 - value) + 'px';
    } else {
        var thumbW = elThumb.clientWidth;
        var trackW = elTrack.clientWidth;
        var travelW = trackW - thumbW;

        var trackX = 0;
        var el = elTrack;
        do {
            trackX += el.offsetLeft;
        } while (el = el.offsetParent);

        var offsetX = Math.max(0, Math.min(travelW, event.pageX - mouseCaptureOffset - trackX));
        var value = offsetX / travelW;
        elThumb.style.left = travelW * value + 'px';
    }

    slidersMod.sliderSetValue(mouseCapture, value);
}

function handleMouseUp() {
    mouseCapture = null;
}


function handleButtonMouseDown(event) {
    var notes = beatMod.theBeat.track1vol;

    var instrumentIndex;
    var trackIndex;

    var elId = event.target.id;
    trackIndex = elId.substr(elId.indexOf('_') + 1, 2);
    instrumentIndex = kitMod.instruments.indexOf(elId.substr(0, elId.indexOf('_')));

    switch (instrumentIndex) {
        case 0: notes = beatMod.theBeat.track1vol; break;
        case 1: notes = beatMod.theBeat.track2vol; break;
        case 2: notes = beatMod.theBeat.track3vol; break;
        case 3: notes = beatMod.theBeat.track4vol; break;
        case 4: notes = beatMod.theBeat.track5vol; break;
        case 5: notes = beatMod.theBeat.track6vol; break;
    }

    var newNoteValue = (notes[trackIndex] + 1) % 3;

    notes[trackIndex] = newNoteValue

    if (instrumentIndex == currentlyActiveInstrument)
        showCorrectNote( trackIndex, notes[trackIndex] );

    drawMod.drawNote(notes[trackIndex], trackIndex, instrumentIndex);

    if (newNoteValue) {
        switch(instrumentIndex) {
        case 0:  // track6
          playMod.playNote(kitMod.currentKit.track6Buffer, false, 0,0,-2, 0.5 * beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 1.0, kitMod.track6Pitch, 0);
          break;

        case 1:  // track5
          playMod.playNote(kitMod.currentKit.track5Buffer, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, kitMod.track5Pitch, 0);
          break;

        case 2:  // track4
          // Pan the track4 according to sequence position.
          playMod.playNote(kitMod.currentKit.track4Buffer, true, 0.5*trackIndex - 4, 0, -1.0, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.7, kitMod.track4Pitch, 0);
          break;

        case 3:  // Tom 1
          playMod.playNote(kitMod.currentKit.track1, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, kitMod.track1Pitch, 0);
          break;

        case 4:  // track2
          playMod.playNote(kitMod.currentKit.track2, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, kitMod.track2Pitch, 0);
          break;

        case 5:  // track3
          playMod.playNote(kitMod.currentKit.track3, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, kitMod.track3Pitch, 0);
          break;
        }
    }

    synthMod.synthCode(newNoteValue, trackIndex, instrumentIndex, beatMod.theBeat)
}

function handleKitComboMouseDown(event) {
    document.getElementById('kitcombo').classList.toggle('active');
}

function handleKitMouseDown(event) {
    var index = kitMod.kitNamePretty.indexOf(event.target.innerHTML);
    beatMod.setBeatKitIndex(index);
    kitMod.setCurrentKit(kitMod.kits[index]);
    document.getElementById('kitname').innerHTML = kitMod.kitNamePretty[index];
}

function handleBodyMouseDown(event) {
    var elKitcombo = document.getElementById('kitcombo');
    var elEffectcombo = document.getElementById('effectcombo');

    if (elKitcombo.classList.contains('active') && !isDescendantOfId(event.target, 'kitcombo_container')) {
        elKitcombo.classList.remove('active');
        if (!isDescendantOfId(event.target, 'effectcombo_container')) {
            event.stopPropagation();
        }
    }

    if (elEffectcombo.classList.contains('active') && !isDescendantOfId(event.target, 'effectcombo')) {
        elEffectcombo.classList.remove('active');
        if (!isDescendantOfId(event.target, 'kitcombo_container')) {
            event.stopPropagation();
        }
    }
}

function isDescendantOfId(el, id) {
    if (el.parentElement) {
        if (el.parentElement.id == id) {
            return true;
        } else {
            return isDescendantOfId(el.parentElement, id);
        }
    } else {
        return false;
    }
}

function handleEffectComboMouseDown(event) {
    if (event.target.id != 'effectlist') {
        document.getElementById('effectcombo').classList.toggle('active');
    }
}

function handleEffectMouseDown(event) {
    for (var i = 0; i < impulseMod.impulseResponseInfoList.length; ++i) {
        if (impulseMod.impulseResponseInfoList[i].name == event.target.innerHTML) {

            // Hack - if effect is turned all the way down - turn up effect slider.
            // ... since they just explicitly chose an effect from the list.
            if (beatMod.theBeat.effectMix == 0)
                beatMod.setBeatEffectMix(0.5);

            impulseMod.setEffect(i);
            drawMod.updateControls();
            break;
        }
    }
}


function loadBeat(beat) {
    // Check that assets are loaded.
    if (beat != beatMod.beatReset && !beat.isLoaded())
        return false;

    handleStop();

    beatMod.setBeat(beatMod.cloneBeat(beat));
    kitMod.setCurrentKit(kitMod.kits[beatMod.theBeat.kitIndex]);
    impulseMod.setEffect(beatMod.theBeat.effectIndex);
    drawMod.updateControls();

    // apply values from sliders
    slidersMod.sliderSetValue('effect_thumb', beatMod.theBeat.effectMix);
    slidersMod.sliderSetValue('track6_thumb', beatMod.theBeat.track6PitchVal);
    slidersMod.sliderSetValue('track5_thumb', beatMod.theBeat.track5PitchVal);
    slidersMod.sliderSetValue('track4_thumb', beatMod.theBeat.track4PitchVal);
    slidersMod.sliderSetValue('track1_thumb', beatMod.theBeat.track1PitchVal);
    slidersMod.sliderSetValue('track2_thumb', beatMod.theBeat.track2PitchVal);
    slidersMod.sliderSetValue('track3_thumb', beatMod.theBeat.track3PitchVal);
    slidersMod.sliderSetValue('swing_thumb', beatMod.theBeat.swingFactor);

    drawMod.updateControls();
    setActiveInstrument(0);

    return true;
}


function handleDemoMouseDown(event) {
    var loaded = false;

    switch(event.target.id) {
        case 'demo1':
            loaded = loadBeat(beatMod.beatDemo[0]);
            break;
        case 'demo2':
            loaded = loadBeat(beatMod.beatDemo[1]);
            break;
        case 'demo3':
            loaded = loadBeat(beatMod.beatDemo[2]);
            break;
        case 'demo4':
            loaded = loadBeat(beatMod.beatDemo[3]);
            break;
        case 'demo5':
            loaded = loadBeat(beatMod.beatDemo[4]);
            break;
    }

    if (loaded)
        handlePlay();
}

function handlePlay(event) {
    playMod.setNoteTime(0.0);
    beatMod.setStartTime(contextMod.context.currentTime + 0.005);
    playMod.schedule();
    timerWorker.postMessage("start");

    document.getElementById('play').classList.add('playing');
    document.getElementById('stop').classList.add('playing');
    if (midiOut) {
        // turn off the play button
        midiOut.send( [0x80, 3, 32] );
        // light up the stop button
        midiOut.send( [0x90, 7, 1] );
    }
}

function handleStop(event) {
    timerWorker.postMessage("stop");

    var elOld = document.getElementById('LED_' + (beatMod.trackIndex + 14) % 16);
    elOld.src = 'images/LED_off.png';

    hideBeat( (beatMod.trackIndex + 14) % 16 );

    beatMod.settrackIndex(0);

    document.getElementById('play').classList.remove('playing');
    document.getElementById('stop').classList.remove('playing');
    if (midiOut) {
        // light up the play button
        midiOut.send( [0x90, 3, 32] );
        // turn off the stop button
        midiOut.send( [0x80, 7, 1] );
    }
}

function handleSave(event) {
    toggleSaveContainer();
    var elTextarea = document.getElementById('save_textarea');
    elTextarea.value = JSON.stringify(beatMod.theBeat);
}

function handleSaveOk(event) {
    toggleSaveContainer();
}

function handleLoad(event) {
    toggleLoadContainer();
}

function handleLoadOk(event) {
    var elTextarea = document.getElementById('load_textarea');
    beatMod.setBeat(JSON.parse(elTextarea.value));

    // Set drumkit
    kitMod.setCurrentKit(kitMod.kits[beatMod.theBeat.kitIndex]);
    document.getElementById('kitname').innerHTML = kitMod.kitNamePretty[beatMod.theBeat.kitIndex];

    // Set effect
    impulseMod.setEffect(beatMod.theBeat.effectIndex);
    drawMod.updateControls();

    // Change the volume of the convolution effect.
    contextMod.setEffectLevel(beatMod.theBeat);

    // Apply values from sliders
    slidersMod.sliderSetValue('effect_thumb', beatMod.theBeat.effectMix);
    slidersMod.sliderSetValue('track6_thumb', beatMod.theBeat.track6PitchVal);
    slidersMod.sliderSetValue('track5_thumb', beatMod.theBeat.track5PitchVal);
    slidersMod.sliderSetValue('track4_thumb', beatMod.theBeat.track4PitchVal);
    slidersMod.sliderSetValue('track1_thumb', beatMod.theBeat.track1PitchVal);
    slidersMod.sliderSetValue('track2_thumb', beatMod.theBeat.track2PitchVal);
    slidersMod.sliderSetValue('track3_thumb', beatMod.theBeat.track3PitchVal);
    slidersMod.sliderSetValue('swing_thumb', beatMod.theBeat.swingFactor);

    // Clear out the text area post-processing
    elTextarea.value = '';

    toggleLoadContainer();
    drawMod.updateControls();
}

function handleLoadCancel(event) {
    toggleLoadContainer();
}

function toggleSaveContainer() {
    document.getElementById('pad').classList.toggle('active');
    document.getElementById('params').classList.toggle('active');
    document.getElementById('tools').classList.toggle('active');
    document.getElementById('save_container').classList.toggle('active');
}

function toggleLoadContainer() {
    document.getElementById('pad').classList.toggle('active');
    document.getElementById('params').classList.toggle('active');
    document.getElementById('tools').classList.toggle('active');
    document.getElementById('load_container').classList.toggle('active');
}

function handleReset(event) {
    handleStop();
    loadBeat(beatMod.beatReset);
}







// functions
exports.handleSliderMouseDown = handleSliderMouseDown;
exports.handleSliderDoubleClick = handleSliderDoubleClick;
exports.handleMouseMove = handleMouseMove;
exports.handleMouseUp = handleMouseUp;
exports.handleButtonMouseDown = handleButtonMouseDown;
exports.handleKitComboMouseDown = handleKitComboMouseDown;
exports.handleKitMouseDown = handleKitMouseDown;
exports.handleBodyMouseDown = handleBodyMouseDown;
exports.handleEffectComboMouseDown = handleEffectComboMouseDown;
exports.handleEffectMouseDown = handleEffectMouseDown;
exports.handleDemoMouseDown = handleDemoMouseDown;
exports.handlePlay = handlePlay;
exports.handleStop = handleStop;
exports.handleSave = handleSave;
exports.handleSaveOk = handleSaveOk;
exports.handleLoad = handleLoad;
exports.handleLoadOk = handleLoadOk;
exports.handleLoadCancel = handleLoadCancel;
exports.handleReset = handleReset;
exports.loadBeat = loadBeat;



//

},{"./beat":1,"./context":3,"./draw":4,"./impulse":6,"./kit":8,"./play":10,"./sliders":11,"./synthesis":12}],6:[function(require,module,exports){
const beatMod = require('./beat')
const contextMod = require('./context')
const slidersMod = require('./sliders')


var impulseResponseInfoList = [
    // Impulse responses - each one represents a unique linear effect.
    {"name":"No Effect", "url":"undefined", "dryMix":1, "wetMix":0},
    {"name":"Spreader 2", "url":"impulse-responses/noise-spreader1.wav",        "dryMix":1, "wetMix":1},
    {"name":"Spring Reverb", "url":"impulse-responses/feedback-spring.wav",     "dryMix":1, "wetMix":1},
    {"name":"Space Oddity", "url":"impulse-responses/filter-track3vol.wav",       "dryMix":1, "wetMix":0.7},
    {"name":"Huge Reverse", "url":"impulse-responses/matrix6-backwards.wav",    "dryMix":0, "wetMix":0.7},
    {"name":"Telephone Filter", "url":"impulse-responses/filter-telephone.wav", "dryMix":0, "wetMix":1.2},
    {"name":"Lopass Filter", "url":"impulse-responses/filter-lopass160.wav",    "dryMix":0, "wetMix":0.5},
    {"name":"Hipass Filter", "url":"impulse-responses/filter-hipass5000.wav",   "dryMix":0, "wetMix":4.0},
    {"name":"Comb 1", "url":"impulse-responses/comb-saw1.wav",                  "dryMix":0, "wetMix":0.7},
    {"name":"Comb 2", "url":"impulse-responses/comb-saw2.wav",                  "dryMix":0, "wetMix":1.0},
    {"name":"Cosmic Ping", "url":"impulse-responses/cosmic-ping-long.wav",      "dryMix":0, "wetMix":0.9},
    {"name":"Kitchen", "url":"impulse-responses/house-impulses/kitchen-true-stereo.wav", "dryMix":1, "wetMix":1},
    {"name":"Living Room", "url":"impulse-responses/house-impulses/dining-living-true-stereo.wav", "dryMix":1, "wetMix":1},
    {"name":"Living-Bedroom", "url":"impulse-responses/house-impulses/living-bedroom-leveled.wav", "dryMix":1, "wetMix":1},
    {"name":"Dining-Far-Kitchen", "url":"impulse-responses/house-impulses/dining-far-kitchen.wav", "dryMix":1, "wetMix":1},
    {"name":"Medium Hall 1", "url":"impulse-responses/matrix-reverb2.wav",      "dryMix":1, "wetMix":1},
    {"name":"Medium Hall 2", "url":"impulse-responses/matrix-reverb3.wav",      "dryMix":1, "wetMix":1},
    {"name":"Peculiar", "url":"impulse-responses/peculiar-backwards.wav",       "dryMix":1, "wetMix":1},
    {"name":"Backslap", "url":"impulse-responses/backslap1.wav",                "dryMix":1, "wetMix":1},
    {"name":"Diffusor", "url":"impulse-responses/diffusor3.wav",                "dryMix":1, "wetMix":1},
    {"name":"Huge", "url":"impulse-responses/matrix-reverb6.wav",               "dryMix":1, "wetMix":0.7},
]

var impulseResponseList = 0;

function setImpulseResponseList (lst) {
  impulseResponseList = lst;
  exports.impulseResponseList = impulseResponseList;
}




function ImpulseResponse(url, index) {
    this.url = url;
    this.index = index;
    this.startedLoading = false;
    this.isLoaded_ = false;
    this.buffer = 0;

    this.demoIndex = -1; // no demo
}

ImpulseResponse.prototype.setDemoIndex = function(index) {
    this.demoIndex = index;
}

ImpulseResponse.prototype.isLoaded = function() {
    return this.isLoaded_;
}

function loadedImpulseResponse(buffer) {
    this.buffer = buffer;
    this.isLoaded_ = true;

    if (this.demoIndex != -1) {
        beatMod.beatDemo[this.demoIndex].setEffectLoaded();
    }
}

ImpulseResponse.prototype.load = function() {
    if (this.startedLoading) {
        return;
    }

    this.startedLoading = true;

    // Load asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", this.url, true);
    request.responseType = "arraybuffer";
    this.request = request;

    var asset = this;

    request.onload = function() {
        contextMod.context.decodeAudioData(request.response, loadedImpulseResponse.bind(asset) );
    }

    request.send();
}


function setEffect(index) {
    if (index > 0 && !impulseResponseList[index].isLoaded()) {
        alert('Sorry, this effect is still loading.  Try again in a few seconds :)');
        return;
    }

    beatMod.setBeatEffectIndex(index)
    contextMod.setEffectDryMix(impulseResponseInfoList[index].dryMix);
    contextMod.setEffectWetMix(impulseResponseInfoList[index].wetMix);
    contextMod.setConvolverBuffer(impulseResponseList[index].buffer);

  // Hack - if the effect is meant to be entirely wet (not unprocessed signal)
  // then put the effect level all the way up.
    if (contextMod.effectDryMix == 0)
        beatMod.setBeatEffectMix(1);

    contextMod.setEffectLevel(beatMod.theBeat);
    slidersMod.sliderSetValue('effect_thumb', beatMod.theBeat.effectMix);

    document.getElementById('effectname').innerHTML = impulseResponseInfoList[index].name;
}



// classes
exports.ImpulseResponse = ImpulseResponse;

// functions
exports.setImpulseResponseList = setImpulseResponseList;
exports.setEffect = setEffect;


// variables
exports.impulseResponseList = impulseResponseList;
exports.impulseResponseInfoList = impulseResponseInfoList;




//

},{"./beat":1,"./context":3,"./sliders":11}],7:[function(require,module,exports){
const beatMod = require('./beat')
const drawMod = require('./draw')
const kitMod = require('./kit')
const impulseMod = require('./impulse')
const handlersMod = require('./handlers')
const playMod = require('./play')
const contextMod = require('./context')

var timeoutId;

function startLoadingAssets() {

    let tmp = new Array();

    for (i = 0; i < impulseMod.impulseResponseInfoList.length; i++) {
        tmp[i] = new impulseMod.ImpulseResponse(impulseMod.impulseResponseInfoList[i].url, i);
    }
    impulseMod.setImpulseResponseList(tmp);

    // Initialize drum kits
    var numKits = kitMod.kitName.length;
    tmp = new Array(numKits);
    for (var i  = 0; i < numKits; i++) {
        tmp[i] = new kitMod.Kit(kitMod.kitName[i]);
    }
    kitMod.setKits(tmp)

    // Start loading the assets used by the presets first, in order of the presets.
    for (var demoIndex = 0; demoIndex < 5; ++demoIndex) {
        var effect = impulseMod.impulseResponseList[beatMod.beatDemo[demoIndex].effectIndex];
        var kit = kitMod.kits[beatMod.beatDemo[demoIndex].kitIndex];

        // These effects and kits will keep track of a particular demo, so we can change
        // the loading status in the UI.
        effect.setDemoIndex(demoIndex);
        kit.setDemoIndex(demoIndex);

        effect.load();
        kit.load();
    }

    // Then load the remaining assets.
    // Note that any assets which have previously started loading will be skipped over.
    for (var i  = 0; i < numKits; i++) {
        kitMod.kits[i].load();
    }

    // Start at 1 to skip "No Effect"
    for (i = 1; i < impulseMod.impulseResponseInfoList.length; i++) {
        impulseMod.impulseResponseList[i].load();
    }

    // Setup initial drumkit
    kitMod.setCurrentKit(kitMod.kits[kitMod.kInitialKitIndex]);
}

function demoButtonURL(demoIndex) {
    var n = demoIndex + 1;
    var demoName = "demo" + n;
    var url = "images/btn_" + demoName + ".png";
    return url;
}

// This gets rid of the loading spinner in each of the demo buttons.
function showDemoAvailable(demoIndex /* zero-based */) {
    var url = demoButtonURL(demoIndex);
    var n = demoIndex + 1;
    var demoName = "demo" + n;
    var demo = document.getElementById(demoName);
    demo.src = url;

    // Enable play button and assign it to demo 2.
    if (demoIndex == 1) {
        showPlayAvailable();
        handlersMod.loadBeat(beatMod.beatDemo[1]);

    // Uncomment to allow autoplay
    //     handlePlay();
    }
}

// This gets rid of the loading spinner on the play button.
function showPlayAvailable() {
    var play = document.getElementById("play");
    play.src = "images/btn_play.png";
}

exports.initDrums = function(cmInstance) {

    // Let the beat demos know when all of their assets have been loaded.
    // Add some new methods to support this.
    for (var i = 0; i < beatMod.beatDemo.length; ++i) {
        beatMod.beatDemo[i].index = i;
        beatMod.beatDemo[i].isKitLoaded = false;
        beatMod.beatDemo[i].isEffectLoaded = false;

        beatMod.beatDemo[i].setKitLoaded = function() {
            this.isKitLoaded = true;
            this.checkIsLoaded();
        };

        beatMod.beatDemo[i].setEffectLoaded = function() {
            this.isEffectLoaded = true;
            this.checkIsLoaded();
        };

        beatMod.beatDemo[i].checkIsLoaded = function() {
            if (this.isLoaded()) {
                showDemoAvailable(this.index);
            }
        };

        beatMod.beatDemo[i].isLoaded = function() {
            return this.isKitLoaded && this.isEffectLoaded;
        };
    }

    startLoadingAssets();

    // NOTE: THIS NOW RELIES ON THE MONKEYPATCH LIBRARY TO LOAD
    // IN CHROME AND SAFARI (until they release unprefixed)
    contextMod.setContext(new AudioContext());

    var finalMixNode;
    if (contextMod.context.createDynamicsCompressor) {
        // Create a dynamics compressor to sweeten the overall mix.
        contextMod.setCompressor(contextMod.context.createDynamicsCompressor());
        contextMod.connectNodes(contextMod.compressor, contextMod.context.destination);
        finalMixNode = contextMod.compressor;
    } else {
        // No compressor available in this implementation.
        finalMixNode = contextMod.context.destination;
    }

    // create master filter node
    let tmp = contextMod.context.createBiquadFilter();
    tmp.type = "lowpass";
    tmp.frequency.value = 0.5 * contextMod.context.sampleRate;
    tmp.Q.value = 1;
    contextMod.setFilterNode(tmp);
    contextMod.connectNodes(contextMod.filterNode, finalMixNode);

    // Create master volume.
    tmp = contextMod.context.createGain();
    tmp.gain.value = 0.7; // reduce overall volume to avoid clipping
    contextMod.setMasterGainNode(tmp);
    contextMod.connectNodes(contextMod.masterGainNode, contextMod.filterNode);

    // Create effect volume.
    tmp = contextMod.context.createGain();
    tmp.gain.value = 1.0; // effect level slider controls this
    contextMod.setEffectLevelNode(tmp);
    contextMod.connectNodes(contextMod.effectLevelNode, contextMod.masterGainNode);

    // Create convolver for effect
    tmp = contextMod.context.createConvolver();
    contextMod.setConvolver(tmp);
    contextMod.connectNodes(contextMod.convolver, contextMod.effectLevelNode);


    var elKitCombo = document.getElementById('kitcombo');
    elKitCombo.addEventListener("mousedown", handlersMod.handleKitComboMouseDown, true);

    var elEffectCombo = document.getElementById('effectcombo');
    elEffectCombo.addEventListener("mousedown", handlersMod.handleEffectComboMouseDown, true);

    document.body.addEventListener("mousedown", handlersMod.handleBodyMouseDown, true);

    var timerWorkerBlob = new Blob([
        "var timeoutID=0;function schedule(){timeoutID=setTimeout(function(){postMessage('schedule'); schedule();},100);} onmessage = function(e) { if (e.data == 'start') { if (!timeoutID) schedule();} else if (e.data == 'stop') {if (timeoutID) clearTimeout(timeoutID); timeoutID=0;};}"]);

    // Obtain a blob URL reference to our worker 'file'.
    var timerWorkerBlobURL = window.URL.createObjectURL(timerWorkerBlob);

    timerWorker = new Worker(timerWorkerBlobURL);
    timerWorker.onmessage = function(e) {
      playMod.schedule();
    };
    timerWorker.postMessage('init'); // Start the worker.

    initControls(timerWorker);
    drawMod.updateControls();

}

function initControls(timerWorker) {
    // Initialize note buttons
    initButtons();
    makeKitList();
    makeEffectList();

    function setMouseDownHandler(elemId, handlerFxn) {
        document.getElementById(elemId).addEventListener('mousedown', handlerFxn, true)
    }
    function seDoubleClickHandler(elemId, handlerFxn) {
        document.getElementById(elemId).addEventListener('dblclick', handlerFxn, true)
    }
    // sliders
    sliderIdNames = ['effect_thumb', 'track1_thumb', 'track2_thumb', 'track3_thumb', 'track4_thumb', 'track5_thumb', 'track6_thumb', 'swing_thumb']
    sliderIdNames.map(idName => setMouseDownHandler(idName, handlersMod.handleSliderMouseDown));
    sliderIdNames.map(idName => seDoubleClickHandler(idName, handlersMod.handleSliderDoubleClick));

    // tool buttons
    setMouseDownHandler('play', ev => handlersMod.handlePlay(timerWorker, ev));
    setMouseDownHandler('stop', ev => handlersMod.handleStop(timerWorker, ev));
    setMouseDownHandler('save', handlersMod.handleSave);
    setMouseDownHandler('save_ok', handlersMod.handleSaveOk);
    setMouseDownHandler('load', handlersMod.handleLoad);
    setMouseDownHandler('load_ok', handlersMod.handleLoadOk);
    setMouseDownHandler('load_cancel', handlersMod.handleLoadCancel);
    setMouseDownHandler('reset', handlersMod.handleReset);
    setMouseDownHandler('tempoinc', beatMod.tempoIncrease);
    setMouseDownHandler('tempodec', beatMod.tempoDecrease);

    demos = ['demo1', 'demo2', 'demo3', 'demo4', 'demo5']
    demos.map(demoName => setMouseDownHandler(demoName, handlersMod.handleDemoMouseDown));

    var elBody = document.getElementById('body');
    elBody.addEventListener('mousemove', handlersMod.handleMouseMove, true);
    elBody.addEventListener('mouseup', handlersMod.handleMouseUp, true);

}

function initButtons() {
    var elButton;

    for (i = 0; i < beatMod.loopLength; ++i) {
        for (j = 0; j < kitMod.kNumInstruments; j++) {
                elButton = document.getElementById(kitMod.instruments[j] + '_' + i);
                elButton.addEventListener("mousedown", handlersMod.handleButtonMouseDown, true);
        }
    }
}

function makeEffectList() {
    var elList = document.getElementById('effectlist');
    var numEffects = impulseMod.impulseResponseInfoList.length;


    var elItem = document.createElement('li');
    elItem.innerHTML = 'None';
    elItem.addEventListener("mousedown", handlersMod.handleEffectMouseDown, true);

    for (var i = 0; i < numEffects; i++) {
        var elItem = document.createElement('li');
        elItem.innerHTML = impulseMod.impulseResponseInfoList[i].name;
        elList.appendChild(elItem);
        elItem.addEventListener("mousedown", handlersMod.handleEffectMouseDown, true);
    }
}

function makeKitList() {
    var elList = document.getElementById('kitlist');
    var numKits = kitMod.kitName.length;

    for (var i = 0; i < numKits; i++) {
        var elItem = document.createElement('li');
        elItem.innerHTML = kitMod.kitNamePretty[i];
        elList.appendChild(elItem);
        elItem.addEventListener("mousedown", handlersMod.handleKitMouseDown, true);
    }
}





//

},{"./beat":1,"./context":3,"./draw":4,"./handlers":5,"./impulse":6,"./kit":8,"./play":10}],8:[function(require,module,exports){
const contextMod = require('./context')
const beatMod = require('./beat')


var track6Pitch = track5Pitch = track4Pitch = track1Pitch = track2Pitch = track3Pitch = 0;

function settrack6Pitch(p) {
  track6Pitch = p;
  exports.track6Pitch = track6Pitch;
}

function settrack5Pitch(p) {
  track5Pitch = p;
  exports.track5Pitch = track5Pitch;
}

function settrack4Pitch(p) {
  track4Pitch = p;
  exports.track4Pitch = track4Pitch;
}

function settrack1Pitch(p) {
  track1Pitch = p;
  exports.track1Pitch = track1Pitch;
}

function settrack2Pitch(p) {
  track2Pitch = p;
  exports.track2Pitch = track2Pitch;
}

function settrack3Pitch(p) {
  track3Pitch = p;
  exports.track3Pitch = track3Pitch;
}



var kits;

function setKits(k) {
    kits = k
    exports.kits = kits
}

var currentKit;

function setCurrentKit(k) {
    currentKit = k
    exports.currentKit = currentKit
}

var kNumInstruments = 6;
var kInitialKitIndex = 10;

var instruments = ['track6', 'track5', 'track4', 'track1', 'track2', 'track3'];


var volumes = [0, 0.3, 1];

// var kitCount = 0;

var kitName = [
    "R8",
    "CR78",
    "KPR77",
    "LINN",
    "Kit3",
    "Kit8",
    "Techno",
    "Stark",
    "breakbeat8",
    "breakbeat9",
    "breakbeat13",
    "acoustic-kit",
    "4OP-FM",
    "TheCheebacabra1",
    "TheCheebacabra2"
    ];

var kitNamePretty = [
    "Roland R-8",
    "Roland CR-78",
    "Korg KPR-77",
    "LinnDrum",
    "Kit 3",
    "Kit 8",
    "Techno",
    "Stark",
    "Breakbeat 8",
    "Breakbeat 9",
    "Breakbeat 13",
    "Acoustic Kit",
    "4OP-FM",
    "The Cheebacabra 1",
    "The Cheebacabra 2"
    ];

function Kit(name) {
    this.name = name;

    this.pathName = function() {
        var pathName = "sounds/drum-samples/" + this.name + "/";
        return pathName;
    };

    this.track6Buffer = 0;
    this.track5Buffer = 0;
    this.track4Buffer = 0;

    this.instrumentCount = kNumInstruments;
    this.instrumentLoadCount = 0;

    this.startedLoading = false;
    this.isLoaded = false;

    this.demoIndex = -1;
}

Kit.prototype.setDemoIndex = function(index) {
    this.demoIndex = index;
}

Kit.prototype.load = function() {
    if (this.startedLoading)
        return;

    this.startedLoading = true;

    var pathName = this.pathName();

    var track6Path = pathName + "track6.wav";
    var track5Path = pathName + "track5.wav";
    var track4Path = pathName + "track4.wav";
    var track1Path = pathName + "track1.wav";
    var track2Path = pathName + "track2.wav";
    var track3Path = pathName + "track3.wav";

    this.loadSample(0, track6Path, false);
    this.loadSample(1, track5Path, false);
    this.loadSample(2, track4Path, true);  // we're panning only the track4
    this.loadSample(3, track1Path, false);
    this.loadSample(4, track2Path, false);
    this.loadSample(5, track3Path, false);
}

var decodedFunctions = [
function (buffer) { this.track6Buffer = buffer; },
function (buffer) { this.track5Buffer = buffer; },
function (buffer) { this.track4Buffer = buffer; },
function (buffer) { this.track1 = buffer; },
function (buffer) { this.track2 = buffer; },
function (buffer) { this.track3 = buffer; } ];

Kit.prototype.loadSample = function(sampleID, url, mixToMono) {
    // Load asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var kit = this;

    request.onload = function() {
        contextMod.context.decodeAudioData(request.response, decodedFunctions[sampleID].bind(kit));

        kit.instrumentLoadCount++;
        if (kit.instrumentLoadCount == kit.instrumentCount) {
            kit.isLoaded = true;

            if (kit.demoIndex != -1) {
                beatMod.beatDemo[kit.demoIndex].setKitLoaded();
            }
        }
    }

    request.send();
}





// classes
exports.Kit = Kit;

// functions
exports.setKits = setKits;
exports.setCurrentKit = setCurrentKit;

exports.settrack6Pitch = settrack6Pitch;
exports.settrack5Pitch = settrack5Pitch;
exports.settrack4Pitch = settrack4Pitch;
exports.settrack1Pitch = settrack1Pitch;
exports.settrack2Pitch = settrack2Pitch;
exports.settrack3Pitch = settrack3Pitch;


// variables
exports.instruments = instruments;
exports.volumes = volumes;
exports.kNumInstruments = kNumInstruments;
exports.kits = kits;
exports.currentKit = currentKit;
exports.kitName = kitName;
exports.kitNamePretty = kitNamePretty;
exports.kInitialKitIndex = kInitialKitIndex;

exports.track6Pitch = track6Pitch;
exports.track5Pitch = track5Pitch;
exports.track4Pitch = track4Pitch;
exports.track1Pitch = track1Pitch;
exports.track2Pitch = track2Pitch;
exports.track3Pitch = track3Pitch;


//

},{"./beat":1,"./context":3}],9:[function(require,module,exports){
const init = require('./init');
const code = require('./codeManager');
const synth = require('./synthesis')

window.onload = function(){
  var cmInstance = code.bootCodeMirror();
  synth.setCMInstance(cmInstance);
  init.initDrums(cmInstance);
}

},{"./codeManager":2,"./init":7,"./synthesis":12}],10:[function(require,module,exports){
const beatMod = require('./beat')
const synthMod = require('./synthesis')
const drawMod = require('./draw')
const kitMod = require('./kit')
const impulseMod = require('./impulse')
const contextMod = require('./context')

var noteTime = 0.0;

function setNoteTime (t) {
  noteTime = t;
  exports.noteTime = noteTime;
}

function advanceNote() {

    newBeat = synthMod.updatePatternFromCode(beatMod.cloneBeat(beatMod.theBeat), beatMod.trackIndex);
    if (newBeat != null) {
        beatMod.setBeat(newBeat)
        drawMod.redrawAllNotes();
    }
    // Advance time by a 16th note...
    var secondsPerBeat = 60.0 / beatMod.theBeat.tempo;

    beatMod.settrackIndex(beatMod.trackIndex + 1);
    if (beatMod.trackIndex == beatMod.loopLength) {
        beatMod.settrackIndex(0);
    }

        // apply swing
    if (beatMod.trackIndex % 2) {
        noteTime += (0.25 + beatMod.kMaxSwing * beatMod.theBeat.swingFactor) * secondsPerBeat;
    } else {
        noteTime += (0.25 - beatMod.kMaxSwing * beatMod.theBeat.swingFactor) * secondsPerBeat;
    }
}

function playNote(buffer, pan, x, y, z, sendGain, mainGain, playbackRate, noteTime) {
    // Create the note
    var voice = contextMod.context.createBufferSource();
    voice.buffer = buffer;
    voice.playbackRate.value = playbackRate;

    // Optionally, connect to a panner
    var finalNode;
    if (pan) {
        var panner = contextMod.context.createPanner();
        panner.panningModel = "HRTF";
        panner.setPosition(x, y, z);
        voice.connect(panner);
        finalNode = panner;
    } else {
        finalNode = voice;
    }

    // Connect to dry mix
    var dryGainNode = contextMod.context.createGain();
    dryGainNode.gain.value = mainGain * contextMod.effectDryMix;
    finalNode.connect(dryGainNode);
    contextMod.connectNodes(dryGainNode, contextMod.masterGainNode);

    // Connect to wet mix
    var wetGainNode = contextMod.context.createGain();
    wetGainNode.gain.value = sendGain;
    finalNode.connect(wetGainNode);
    contextMod.connectNodes(wetGainNode, contextMod.convolver);

    voice.start(noteTime);
}

function schedule() {
    var currentTime = contextMod.context.currentTime;

    // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
    currentTime -= beatMod.startTime;

    while (noteTime < currentTime + 0.120) {
        // Convert noteTime to context time.
        var contextPlayTime = noteTime + beatMod.startTime;

        // track6
        if (beatMod.theBeat.track1vol[beatMod.trackIndex] && instrumentActive[0]) {
            playNote(kitMod.currentKit.track6Buffer, false, 0,0,-2, 0.5, kitMod.volumes[beatMod.theBeat.track1vol[beatMod.trackIndex]] * 1.0, kitMod.track6Pitch, contextPlayTime);
        }

        // track5
        if (beatMod.theBeat.track2vol[beatMod.trackIndex] && instrumentActive[1]) {
            playNote(kitMod.currentKit.track5Buffer, false, 0,0,-2, 1, kitMod.volumes[beatMod.theBeat.track2vol[beatMod.trackIndex]] * 0.6, kitMod.track5Pitch, contextPlayTime);
        }

        // track4
        if (beatMod.theBeat.track3vol[beatMod.trackIndex] && instrumentActive[2]) {
            // Pan the track4 according to sequence position.
            playNote(kitMod.currentKit.track4Buffer, true, 0.5*beatMod.trackIndex - 4, 0, -1.0, 1, kitMod.volumes[beatMod.theBeat.track3vol[beatMod.trackIndex]] * 0.7, kitMod.track4Pitch, contextPlayTime);
        }

        // Toms
        if (beatMod.theBeat.track4vol[beatMod.trackIndex] && instrumentActive[3]) {
            playNote(kitMod.currentKit.track1, false, 0,0,-2, 1, kitMod.volumes[beatMod.theBeat.track4vol[beatMod.trackIndex]] * 0.6, kitMod.track1Pitch, contextPlayTime);
        }

        if (beatMod.theBeat.track5vol[beatMod.trackIndex] && instrumentActive[4]) {
            playNote(kitMod.currentKit.track2, false, 0,0,-2, 1, kitMod.volumes[beatMod.theBeat.track5vol[beatMod.trackIndex]] * 0.6, kitMod.track2Pitch, contextPlayTime);
        }

        if (beatMod.theBeat.track6vol[beatMod.trackIndex] && instrumentActive[5]) {
            playNote(kitMod.currentKit.track3, false, 0,0,-2, 1, kitMod.volumes[beatMod.theBeat.track6vol[beatMod.trackIndex]] * 0.6, kitMod.track3Pitch, contextPlayTime);
        }


        // Attempt to synchronize drawing time with sound
        if (noteTime != drawMod.lastDrawTime) {
            drawMod.setLastDrawTime(noteTime);
            drawMod.drawPlayhead((beatMod.trackIndex + 15) % 16);
        }

        advanceNote();
    }
}

function playDrum(noteNumber, velocity) {
    switch (noteNumber) {
        case 0x24:
            playNote(kitMod.currentKit.track6Buffer,  false, 0,0,-2,  0.5, (velocity / 127), kitMod.track6Pitch,  0);
            break;
        case 0x26:
            playNote(kitMod.currentKit.track5Buffer, false, 0,0,-2,  1,   (velocity / 127), kitMod.track5Pitch, 0);
            break;
        case 0x28:
            playNote(kitMod.currentKit.track4Buffer, true,  0,0,-1.0,1,   (velocity / 127), kitMod.track4Pitch, 0);
            break;
        case 0x2d:
            playNote(kitMod.currentKit.track1,        false, 0,0,-2,  1,   (velocity / 127), kitMod.track1Pitch,  0);
            break;
        case 0x2f:
            playNote(kitMod.currentKit.track2,        false, 0,0,-2,  1,   (velocity / 127), kitMod.track2Pitch,  0);
            break;
        case 0x32:
            playNote(kitMod.currentKit.track3,        false, 0,0,-2,  1,   (velocity / 127), kitMod.track3Pitch,  0);
            break;
        default:
            console.log("note:0x" + noteNumber.toString(16) );
    }
}

// functions
exports.advanceNote = advanceNote;
exports.playNote = playNote;
exports.schedule = schedule;
exports.playDrum = playDrum;

exports.setNoteTime = setNoteTime;


// variables
exports.noteTime = noteTime;



//

},{"./beat":1,"./context":3,"./draw":4,"./impulse":6,"./kit":8,"./synthesis":12}],11:[function(require,module,exports){
const beatMod = require('./beat')
const kitMod = require('./kit')
const contextMod = require('./context')


function sliderSetValue(slider, value) {
    var pitchRate = Math.pow(2.0, 2.0 * (value - 0.5));

    switch(slider) {
    case 'effect_thumb':
        // Change the volume of the convolution effect.
        beatMod.setBeatEffectMix(value);
        contextMod.setEffectLevel(beatMod.theBeat);
        break;
    case 'track6_thumb':
        beatMod.setBeattrack6PitchVal(value);
        kitMod.settrack6Pitch(pitchRate);
        break;
    case 'track5_thumb':
        beatMod.setBeattrack5PitchVal(value);
        kitMod.settrack5Pitch(pitchRate);
        break;
    case 'track4_thumb':
        beatMod.setBeattrack4PitchVal(value);
        kitMod.settrack4Pitch(pitchRate);
        break;
    case 'track1_thumb':
        beatMod.setBeattrack1PitchVal(value);
        kitMod.settrack1Pitch(pitchRate);
        break;
    case 'track2_thumb':
        beatMod.setBeattrack2PitchVal(value);
        kitMod.settrack2Pitch(pitchRate);
        break;
    case 'track3_thumb':
        beatMod.setBeattrack3PitchVal(value);
        kitMod.settrack3Pitch(pitchRate);
        break;
    case 'swing_thumb':
        beatMod.setBeatSwingFactor(value);
        break;
    }
}




// functions
exports.sliderSetValue = sliderSetValue;

},{"./beat":1,"./context":3,"./kit":8}],12:[function(require,module,exports){
//We pull this in on init, which allows us to grab code as the drum machine runs
var codeMirrorInstance = null

function setCMInstance (cm) {
    codeMirrorInstance = cm;
}

function addLineForPointChange(currentCode,newNoteValue, trackIndex, instrumentIndex) {
    //generate new line for changed note
    newLine = "  b.track" + (instrumentIndex+1) + "[" + trackIndex + "] = " + newNoteValue + ";\n"
    existingLineLoc = currentCode.indexOf("  b.track" + (instrumentIndex+1) + "[" + trackIndex + "] =")
    //if code has a line explicitly changed this point, then we update its value
    if (existingLineLoc >=0) {
        var lineChPos = codeMirrorInstance.posFromIndex(existingLineLoc);
        var endReplacePos = JSON.parse(JSON.stringify(lineChPos));
        endReplacePos.ch = newLine.length+1;
        codeMirrorInstance
            .replaceRange(newLine.slice(0, -1), lineChPos, endReplacePos);
    }
    //else code currently has no effect on manually changed pattern, so we can just add a line
    else {
        codeMirrorInstance.replaceRange(newLine, {line: codeMirrorInstance.lineCount()-2, ch: 0})
    }
    return codeMirrorInstance.getValue();
}

function synthCode(newNoteValue, trackIndex, instrumentIndex, theBeat) {
    //get current code
    var currentCode = codeMirrorInstance.getValue()

    var updatedCode = addLineForPointChange(currentCode,newNoteValue, trackIndex, instrumentIndex)

    socket.emit('code', {"code":updatedCode, "beat":theBeat});
    
    // currently, if we get new code any time, we replace code with synthesized code
    // TODO we need something a bit more tasteful - e.g. put new code in a "proposed change" box 
    socket.on('newCode', function(c) {
        codeMirrorInstance.replaceRange(c, {line: 2, ch:0}, {line: codeMirrorInstance.lineCount()-2, ch: 0});
    });
}

function updatePatternFromCode(currentBeat, trackIndex){
    //every time we advance a time step, pull latest code and update beat object
    var updatedCode = codeMirrorInstance.getValue()
    try {
        //TODO if(codeChanged) {
        let f = new Function("theBeat", "trackIndex", '"use strict"; ' + updatedCode + ' return (genBeat(theBeat, trackIndex));');
        let newBeat = f(currentBeat, trackIndex);
        for (i = 1; i <= 6; i++) {
            newBeat['track'+i.toString()] = newBeat['track'+i.toString()].map((note) => {if (Number.isNaN(note)) {return 0;} else {return note}});
        }
        if (isValidBeat(newBeat)) { // && theBeat != newBeat){
            return newBeat;
        }
    }
    catch(err) {
      console.log("updatePatternFromCode error")
      console.log(err)
    }
    return null;
}

function isValidBeat(beat) {

    var valid = true;
    for (i = 1; i <= 6; i++) {
        valid = valid &&
            Array.isArray(beat['track'+i.toString()]) &&
            beat['track'+i.toString()].every((v) => v <=2 && v >=0);
    }
    console.log(valid);
    return valid;
}


exports.setCMInstance = setCMInstance
exports.synthCode = synthCode
exports.updatePatternFromCode = updatePatternFromCode

//

},{}]},{},[9]);
