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
var rhythmIndex = 0;

function setRhythmIndex(idx) {
    rhythmIndex = idx;
    exports.rhythmIndex = rhythmIndex;
}

var beatReset = {"kitIndex":0,"effectIndex":0,"tempo":100,"swingFactor":0,"effectMix":0.25,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5,"tom1PitchVal":0.5,"tom2PitchVal":0.5,"tom3PitchVal":0.5,"rhythm1":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm2":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm3":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm4":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm5":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm6":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};
var beatDemo = [
    {"kitIndex":13,"effectIndex":18,"tempo":120,"swingFactor":0,"effectMix":0.19718309859154926,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5,"tom1PitchVal":0.5,"tom2PitchVal":0.5,"tom3PitchVal":0.5,"rhythm1":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm2":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm3":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm4":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm5":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm6":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
    {"kitIndex":4,"effectIndex":12,"tempo":100,"swingFactor":0,"effectMix":0.2,"kickPitchVal":0.46478873239436624,"snarePitchVal":0.45070422535211263,"hihatPitchVal":0.15492957746478875,"tom1PitchVal":0.7183098591549295,"tom2PitchVal":0.704225352112676,"tom3PitchVal":0.8028169014084507,"rhythm1":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm2":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm3":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm4":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm5":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm6":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
    {"kitIndex":2,"effectIndex":5,"tempo":100,"swingFactor":0,"effectMix":0.25,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5211267605633803,"tom1PitchVal":0.23943661971830987,"tom2PitchVal":0.21126760563380287,"tom3PitchVal":0.2535211267605634,"rhythm1":[2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0],"rhythm2":[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0],"rhythm3":[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],"rhythm4":[1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],"rhythm5":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],"rhythm6":[0,0,1,0,1,0,0,2,0,2,0,0,1,0,0,0]},
    {"kitIndex":1,"effectIndex":4,"tempo":120,"swingFactor":0,"effectMix":0.25,"kickPitchVal":0.7887323943661972,"snarePitchVal":0.49295774647887325,"hihatPitchVal":0.5,"tom1PitchVal":0.323943661971831,"tom2PitchVal":0.3943661971830986,"tom3PitchVal":0.323943661971831,"rhythm1":[2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1],"rhythm2":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm3":[0,0,1,0,2,0,1,0,1,0,1,0,2,0,2,0],"rhythm4":[2,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0],"rhythm5":[0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm6":[0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0]},
    {"kitIndex":0,"effectIndex":1,"tempo":60,"swingFactor":0.5419847328244275,"effectMix":0.25,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5,"tom1PitchVal":0.5,"tom2PitchVal":0.5,"tom3PitchVal":0.5,"rhythm1":[2,2,0,1,2,2,0,1,2,2,0,1,2,2,0,1],"rhythm2":[0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],"rhythm3":[2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1],"rhythm4":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm5":[0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0],"rhythm6":[1,0,0,1,0,1,0,1,1,0,0,1,1,1,1,0]},
];


function cloneBeat(source) {
    var beat = new Object();

    beat.kitIndex = source.kitIndex;
    beat.effectIndex = source.effectIndex;
    beat.tempo = source.tempo;
    beat.swingFactor = source.swingFactor;
    beat.effectMix = source.effectMix;
    beat.kickPitchVal = source.kickPitchVal;
    beat.snarePitchVal = source.snarePitchVal;
    beat.hihatPitchVal = source.hihatPitchVal;
    beat.tom1PitchVal = source.tom1PitchVal;
    beat.tom2PitchVal = source.tom2PitchVal;
    beat.tom3PitchVal = source.tom3PitchVal;
    beat.rhythm1 = source.rhythm1.slice(0);        // slice(0) is an easy way to copy the full array
    beat.rhythm2 = source.rhythm2.slice(0);
    beat.rhythm3 = source.rhythm3.slice(0);
    beat.rhythm4 = source.rhythm4.slice(0);
    beat.rhythm5 = source.rhythm5.slice(0);
    beat.rhythm6 = source.rhythm6.slice(0);

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

function setBeatKickPitchVal(value) {
    theBeat.kickPitchVal = value;
    exports.theBeat = theBeat
}

function setBeatSnarePitchVal(value) {
    theBeat.snarePitchVal = value;
    exports.theBeat = theBeat
}

function setBeatHihatPitchVal(value) {
    theBeat.hihatPitchVal = value;
    exports.theBeat = theBeat
}

function setBeatTom1PitchVal(value) {
    theBeat.tom1PitchVal = value;
    exports.theBeat = theBeat
}

function setBeatTom2PitchVal(value) {
    theBeat.tom2PitchVal = value;
    exports.theBeat = theBeat
}

function setBeatTom3PitchVal(value) {
    theBeat.tom3PitchVal = value;
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
exports.setBeatKickPitchVal = setBeatKickPitchVal;
exports.setBeatSnarePitchVal = setBeatSnarePitchVal;
exports.setBeatHihatPitchVal = setBeatHihatPitchVal;
exports.setBeatTom1PitchVal = setBeatTom1PitchVal;
exports.setBeatTom2PitchVal = setBeatTom2PitchVal;
exports.setBeatTom3PitchVal = setBeatTom3PitchVal;
exports.setBeatSwingFactor = setBeatSwingFactor;

exports.setBeatKitIndex = setBeatKitIndex;
exports.setBeatEffectIndex = setBeatEffectIndex;
exports.setRhythmIndex = setRhythmIndex;
exports.setStartTime = setStartTime;

exports.cloneBeat = cloneBeat;
exports.tempoIncrease = tempoIncrease;
exports.tempoDecrease = tempoDecrease;

// variables
exports.theBeat = theBeat;
exports.beatReset = beatReset;
exports.beatDemo = beatDemo;
exports.loopLength = loopLength;
exports.rhythmIndex = rhythmIndex;
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
    for (y = 0; y < 6; y++) { //6 rhythm patterns in theBeat
        for (x = 0; x < 16; x++)  { //16 beat subdivisions
            if(x >= beatMod.theBeat['rhythm'+(y+1).toString()].length){
                drawNote(0, x, y);
            }
            else {
                drawNote(beatMod.theBeat['rhythm'+(y+1).toString()][x], x, y);
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
                case 0: notes = beatMod.theBeat.rhythm1; break;
                case 1: notes = beatMod.theBeat.rhythm2; break;
                case 2: notes = beatMod.theBeat.rhythm3; break;
                case 3: notes = beatMod.theBeat.rhythm4; break;
                case 4: notes = beatMod.theBeat.rhythm5; break;
                case 5: notes = beatMod.theBeat.rhythm6; break;
            }

            drawNote(notes[i], i, j);
        }
    }

    document.getElementById('kitname').innerHTML = kitMod.kitNamePretty[beatMod.theBeat.kitIndex];
    document.getElementById('effectname').innerHTML = impulseMod.impulseResponseInfoList[beatMod.theBeat.effectIndex].name;
    document.getElementById('tempo').innerHTML = beatMod.theBeat.tempo;
    sliderSetPosition('swing_thumb', beatMod.theBeat.swingFactor);
    sliderSetPosition('effect_thumb', beatMod.theBeat.effectMix);
    sliderSetPosition('kick_thumb', beatMod.theBeat.kickPitchVal);
    sliderSetPosition('snare_thumb', beatMod.theBeat.snarePitchVal);
    sliderSetPosition('hihat_thumb', beatMod.theBeat.hihatPitchVal);
    sliderSetPosition('tom1_thumb', beatMod.theBeat.tom1PitchVal);
    sliderSetPosition('tom2_thumb', beatMod.theBeat.tom2PitchVal);
    sliderSetPosition('tom3_thumb', beatMod.theBeat.tom3PitchVal);
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
    var notes = beatMod.theBeat.rhythm1;

    var instrumentIndex;
    var rhythmIndex;

    var elId = event.target.id;
    rhythmIndex = elId.substr(elId.indexOf('_') + 1, 2);
    instrumentIndex = kitMod.instruments.indexOf(elId.substr(0, elId.indexOf('_')));

    switch (instrumentIndex) {
        case 0: notes = beatMod.theBeat.rhythm1; break;
        case 1: notes = beatMod.theBeat.rhythm2; break;
        case 2: notes = beatMod.theBeat.rhythm3; break;
        case 3: notes = beatMod.theBeat.rhythm4; break;
        case 4: notes = beatMod.theBeat.rhythm5; break;
        case 5: notes = beatMod.theBeat.rhythm6; break;
    }

    var newNoteValue = (notes[rhythmIndex] + 1) % 3;

    notes[rhythmIndex] = newNoteValue

    if (instrumentIndex == currentlyActiveInstrument)
        showCorrectNote( rhythmIndex, notes[rhythmIndex] );

    drawMod.drawNote(notes[rhythmIndex], rhythmIndex, instrumentIndex);

    if (newNoteValue) {
        switch(instrumentIndex) {
        case 0:  // Kick
          playMod.playNote(kitMod.currentKit.kickBuffer, false, 0,0,-2, 0.5 * beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 1.0, kitMod.kickPitch, 0);
          break;

        case 1:  // Snare
          playMod.playNote(kitMod.currentKit.snareBuffer, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, kitMod.snarePitch, 0);
          break;

        case 2:  // Hihat
          // Pan the hihat according to sequence position.
          playMod.playNote(kitMod.currentKit.hihatBuffer, true, 0.5*rhythmIndex - 4, 0, -1.0, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.7, kitMod.hihatPitch, 0);
          break;

        case 3:  // Tom 1
          playMod.playNote(kitMod.currentKit.tom1, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, kitMod.tom1Pitch, 0);
          break;

        case 4:  // Tom 2
          playMod.playNote(kitMod.currentKit.tom2, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, kitMod.tom2Pitch, 0);
          break;

        case 5:  // Tom 3
          playMod.playNote(kitMod.currentKit.tom3, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, kitMod.tom3Pitch, 0);
          break;
        }
    }

    synthMod.synthCode(newNoteValue, rhythmIndex, instrumentIndex, beatMod.theBeat)
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
    slidersMod.sliderSetValue('kick_thumb', beatMod.theBeat.kickPitchVal);
    slidersMod.sliderSetValue('snare_thumb', beatMod.theBeat.snarePitchVal);
    slidersMod.sliderSetValue('hihat_thumb', beatMod.theBeat.hihatPitchVal);
    slidersMod.sliderSetValue('tom1_thumb', beatMod.theBeat.tom1PitchVal);
    slidersMod.sliderSetValue('tom2_thumb', beatMod.theBeat.tom2PitchVal);
    slidersMod.sliderSetValue('tom3_thumb', beatMod.theBeat.tom3PitchVal);
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

    var elOld = document.getElementById('LED_' + (beatMod.rhythmIndex + 14) % 16);
    elOld.src = 'images/LED_off.png';

    hideBeat( (beatMod.rhythmIndex + 14) % 16 );

    beatMod.setRhythmIndex(0);

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
    slidersMod.sliderSetValue('kick_thumb', beatMod.theBeat.kickPitchVal);
    slidersMod.sliderSetValue('snare_thumb', beatMod.theBeat.snarePitchVal);
    slidersMod.sliderSetValue('hihat_thumb', beatMod.theBeat.hihatPitchVal);
    slidersMod.sliderSetValue('tom1_thumb', beatMod.theBeat.tom1PitchVal);
    slidersMod.sliderSetValue('tom2_thumb', beatMod.theBeat.tom2PitchVal);
    slidersMod.sliderSetValue('tom3_thumb', beatMod.theBeat.tom3PitchVal);
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
    {"name":"Space Oddity", "url":"impulse-responses/filter-rhythm3.wav",       "dryMix":1, "wetMix":0.7},
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
    sliderIdNames = ['effect_thumb', 'tom1_thumb', 'tom2_thumb', 'tom3_thumb', 'hihat_thumb', 'snare_thumb', 'kick_thumb', 'swing_thumb']
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


var kickPitch = snarePitch = hihatPitch = tom1Pitch = tom2Pitch = tom3Pitch = 0;

function setKickPitch(p) {
  kickPitch = p;
  exports.kickPitch = kickPitch;
}

function setSnarePitch(p) {
  snarePitch = p;
  exports.snarePitch = snarePitch;
}

function setHihatPitch(p) {
  hihatPitch = p;
  exports.hihatPitch = hihatPitch;
}

function setTom1Pitch(p) {
  tom1Pitch = p;
  exports.tom1Pitch = tom1Pitch;
}

function setTom2Pitch(p) {
  tom2Pitch = p;
  exports.tom2Pitch = tom2Pitch;
}

function setTom3Pitch(p) {
  tom3Pitch = p;
  exports.tom3Pitch = tom3Pitch;
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

var instruments = ['Kick', 'Snare', 'HiHat', 'Tom1', 'Tom2', 'Tom3'];


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

    this.kickBuffer = 0;
    this.snareBuffer = 0;
    this.hihatBuffer = 0;

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

    var kickPath = pathName + "kick.wav";
    var snarePath = pathName + "snare.wav";
    var hihatPath = pathName + "hihat.wav";
    var tom1Path = pathName + "tom1.wav";
    var tom2Path = pathName + "tom2.wav";
    var tom3Path = pathName + "tom3.wav";

    this.loadSample(0, kickPath, false);
    this.loadSample(1, snarePath, false);
    this.loadSample(2, hihatPath, true);  // we're panning only the hihat
    this.loadSample(3, tom1Path, false);
    this.loadSample(4, tom2Path, false);
    this.loadSample(5, tom3Path, false);
}

var decodedFunctions = [
function (buffer) { this.kickBuffer = buffer; },
function (buffer) { this.snareBuffer = buffer; },
function (buffer) { this.hihatBuffer = buffer; },
function (buffer) { this.tom1 = buffer; },
function (buffer) { this.tom2 = buffer; },
function (buffer) { this.tom3 = buffer; } ];

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

exports.setKickPitch = setKickPitch;
exports.setSnarePitch = setSnarePitch;
exports.setHihatPitch = setHihatPitch;
exports.setTom1Pitch = setTom1Pitch;
exports.setTom2Pitch = setTom2Pitch;
exports.setTom3Pitch = setTom3Pitch;


// variables
exports.instruments = instruments;
exports.volumes = volumes;
exports.kNumInstruments = kNumInstruments;
exports.kits = kits;
exports.currentKit = currentKit;
exports.kitName = kitName;
exports.kitNamePretty = kitNamePretty;
exports.kInitialKitIndex = kInitialKitIndex;

exports.kickPitch = kickPitch;
exports.snarePitch = snarePitch;
exports.hihatPitch = hihatPitch;
exports.tom1Pitch = tom1Pitch;
exports.tom2Pitch = tom2Pitch;
exports.tom3Pitch = tom3Pitch;


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

    newBeat = synthMod.updatePatternFromCode(beatMod.cloneBeat(beatMod.theBeat), beatMod.rhythmIndex);
    if (newBeat != null) {
        beatMod.setBeat(newBeat)
        drawMod.redrawAllNotes();
    }
    // Advance time by a 16th note...
    var secondsPerBeat = 60.0 / beatMod.theBeat.tempo;

    beatMod.setRhythmIndex(beatMod.rhythmIndex + 1);
    if (beatMod.rhythmIndex == beatMod.loopLength) {
        beatMod.setRhythmIndex(0);
    }

        // apply swing
    if (beatMod.rhythmIndex % 2) {
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

        // Kick
        if (beatMod.theBeat.rhythm1[beatMod.rhythmIndex] && instrumentActive[0]) {
            playNote(kitMod.currentKit.kickBuffer, false, 0,0,-2, 0.5, kitMod.volumes[beatMod.theBeat.rhythm1[beatMod.rhythmIndex]] * 1.0, kitMod.kickPitch, contextPlayTime);
        }

        // Snare
        if (beatMod.theBeat.rhythm2[beatMod.rhythmIndex] && instrumentActive[1]) {
            playNote(kitMod.currentKit.snareBuffer, false, 0,0,-2, 1, kitMod.volumes[beatMod.theBeat.rhythm2[beatMod.rhythmIndex]] * 0.6, kitMod.snarePitch, contextPlayTime);
        }

        // Hihat
        if (beatMod.theBeat.rhythm3[beatMod.rhythmIndex] && instrumentActive[2]) {
            // Pan the hihat according to sequence position.
            playNote(kitMod.currentKit.hihatBuffer, true, 0.5*beatMod.rhythmIndex - 4, 0, -1.0, 1, kitMod.volumes[beatMod.theBeat.rhythm3[beatMod.rhythmIndex]] * 0.7, kitMod.hihatPitch, contextPlayTime);
        }

        // Toms
        if (beatMod.theBeat.rhythm4[beatMod.rhythmIndex] && instrumentActive[3]) {
            playNote(kitMod.currentKit.tom1, false, 0,0,-2, 1, kitMod.volumes[beatMod.theBeat.rhythm4[beatMod.rhythmIndex]] * 0.6, kitMod.tom1Pitch, contextPlayTime);
        }

        if (beatMod.theBeat.rhythm5[beatMod.rhythmIndex] && instrumentActive[4]) {
            playNote(kitMod.currentKit.tom2, false, 0,0,-2, 1, kitMod.volumes[beatMod.theBeat.rhythm5[beatMod.rhythmIndex]] * 0.6, kitMod.tom2Pitch, contextPlayTime);
        }

        if (beatMod.theBeat.rhythm6[beatMod.rhythmIndex] && instrumentActive[5]) {
            playNote(kitMod.currentKit.tom3, false, 0,0,-2, 1, kitMod.volumes[beatMod.theBeat.rhythm6[beatMod.rhythmIndex]] * 0.6, kitMod.tom3Pitch, contextPlayTime);
        }


        // Attempt to synchronize drawing time with sound
        if (noteTime != drawMod.lastDrawTime) {
            drawMod.setLastDrawTime(noteTime);
            drawMod.drawPlayhead((beatMod.rhythmIndex + 15) % 16);
        }

        advanceNote();
    }
}

function playDrum(noteNumber, velocity) {
    switch (noteNumber) {
        case 0x24:
            playNote(kitMod.currentKit.kickBuffer,  false, 0,0,-2,  0.5, (velocity / 127), kitMod.kickPitch,  0);
            break;
        case 0x26:
            playNote(kitMod.currentKit.snareBuffer, false, 0,0,-2,  1,   (velocity / 127), kitMod.snarePitch, 0);
            break;
        case 0x28:
            playNote(kitMod.currentKit.hihatBuffer, true,  0,0,-1.0,1,   (velocity / 127), kitMod.hihatPitch, 0);
            break;
        case 0x2d:
            playNote(kitMod.currentKit.tom1,        false, 0,0,-2,  1,   (velocity / 127), kitMod.tom1Pitch,  0);
            break;
        case 0x2f:
            playNote(kitMod.currentKit.tom2,        false, 0,0,-2,  1,   (velocity / 127), kitMod.tom2Pitch,  0);
            break;
        case 0x32:
            playNote(kitMod.currentKit.tom3,        false, 0,0,-2,  1,   (velocity / 127), kitMod.tom3Pitch,  0);
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
    case 'kick_thumb':
        beatMod.setBeatKickPitchVal(value);
        kitMod.setKickPitch(pitchRate);
        break;
    case 'snare_thumb':
        beatMod.setBeatSnarePitchVal(value);
        kitMod.setSnarePitch(pitchRate);
        break;
    case 'hihat_thumb':
        beatMod.setBeatHihatPitchVal(value);
        kitMod.setHihatPitch(pitchRate);
        break;
    case 'tom1_thumb':
        beatMod.setBeatTom1PitchVal(value);
        kitMod.setTom1Pitch(pitchRate);
        break;
    case 'tom2_thumb':
        beatMod.setBeatTom2PitchVal(value);
        kitMod.setTom2Pitch(pitchRate);
        break;
    case 'tom3_thumb':
        beatMod.setBeatTom3PitchVal(value);
        kitMod.setTom3Pitch(pitchRate);
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

function addLineForPointChange(currentCode,newNoteValue, rhythmIndex, instrumentIndex) {
    //generate new line for changed note
    newLine = "  b.rhythm" + (instrumentIndex+1) + "[" + rhythmIndex + "] = " + newNoteValue + ";\n"
    existingLineLoc = currentCode.indexOf("  b.rhythm" + (instrumentIndex+1) + "[" + rhythmIndex + "] =")
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

function synthCode(newNoteValue, rhythmIndex, instrumentIndex, theBeat) {
    //get current code
    var currentCode = codeMirrorInstance.getValue()

    var updatedCode = addLineForPointChange(currentCode,newNoteValue, rhythmIndex, instrumentIndex)

    socket.emit('code', {"code":updatedCode, "beat":theBeat});
    
    // currently, if we get new code any time, we replace code with synthesized code
    // TODO we need something a bit more tasteful - e.g. put new code in a "proposed change" box 
    socket.on('newCode', function(c) {
        codeMirrorInstance.replaceRange(c, {line: 2, ch:0}, {line: codeMirrorInstance.lineCount()-2, ch: 0});
    });
}

function updatePatternFromCode(currentBeat, rhythmIndex){
    //every time we advance a time step, pull latest code and update beat object
    var updatedCode = codeMirrorInstance.getValue()
    try {
        //TODO if(codeChanged) {
        let f = new Function("theBeat", "rhythmIndex", '"use strict"; ' + updatedCode + ' return (genBeat(theBeat, rhythmIndex));');
        let newBeat = f(currentBeat, rhythmIndex);
        for (i = 1; i <= 6; i++) {
            newBeat['rhythm'+i.toString()] = newBeat['rhythm'+i.toString()].map((note) => {if (Number.isNaN(note)) {return 0;} else {return note}});
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
            Array.isArray(beat['rhythm'+i.toString()]) &&
            beat['rhythm'+i.toString()].every((v) => v <=2 && v >=0);
    }
    console.log(valid);
    return valid;
}


exports.setCMInstance = setCMInstance
exports.synthCode = synthCode
exports.updatePatternFromCode = updatePatternFromCode

//

},{}]},{},[9]);
