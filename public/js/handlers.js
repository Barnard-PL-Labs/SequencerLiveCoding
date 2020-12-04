const beatMod = require('./beat')
const kitMod = require('./kit')
const drawMod = require('./draw')
const synthMod = require('./synthesis')
const impulseMod = require('./impulse')
const playMod = require('./play')

const drums = require('./drummachine')

var timerWorker = null; // Worker thread to send us scheduling messages.

function setTimerWorker (tw) {
  timerWorker = tw;
  exports.timerWorker = timerWorker;
}


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
        sliderSetValue(event.target.id, 0.5);
        updateControls();
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

    sliderSetValue(mouseCapture, value);
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
          playMod.playNote(kitMod.currentKit.kickBuffer, false, 0,0,-2, 0.5 * beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 1.0, kickPitch, 0);
          break;

        case 1:  // Snare
          playMod.playNote(kitMod.currentKit.snareBuffer, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, snarePitch, 0);
          break;

        case 2:  // Hihat
          // Pan the hihat according to sequence position.
          playMod.playNote(kitMod.currentKit.hihatBuffer, true, 0.5*rhythmIndex - 4, 0, -1.0, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.7, hihatPitch, 0);
          break;

        case 3:  // Tom 1
          playMod.playNote(kitMod.currentKit.tom1, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, tom1Pitch, 0);
          break;

        case 4:  // Tom 2
          playMod.playNote(kitMod.currentKit.tom2, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, tom2Pitch, 0);
          break;

        case 5:  // Tom 3
          playMod.playNote(kitMod.currentKit.tom3, false, 0,0,-2, beatMod.theBeat.effectMix, kitMod.volumes[newNoteValue] * 0.6, tom3Pitch, 0);
          break;
        }
    }

    synthMod.synthCode(newNoteValue, rhythmIndex, instrumentIndex)
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

            drums.setEffect(i);
            break;
        }
    }
}



function handleDemoMouseDown(event) {
    var loaded = false;

    switch(event.target.id) {
        case 'demo1':
            loaded = drums.loadBeat(beatMod.beatDemo[0]);
            break;
        case 'demo2':
            loaded = drums.loadBeat(beatMod.beatDemo[1]);
            break;
        case 'demo3':
            loaded = drums.loadBeat(beatMod.beatDemo[2]);
            break;
        case 'demo4':
            loaded = drums.loadBeat(beatMod.beatDemo[3]);
            break;
        case 'demo5':
            loaded = drums.loadBeat(beatMod.beatDemo[4]);
            break;
    }

    if (loaded)
        handlePlay();
}

function handlePlay(event) {
    noteTime = 0.0;
    beatMod.setStartTime(drums.context.currentTime + 0.005);
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
    drums.setEffect(beatMod.theBeat.effectIndex);

    // Change the volume of the convolution effect.
    drums.setEffectLevel(beatMod.theBeat);

    // Apply values from sliders
    sliderSetValue('effect_thumb', beatMod.theBeat.effectMix);
    sliderSetValue('kick_thumb', beatMod.theBeat.kickPitchVal);
    sliderSetValue('snare_thumb', beatMod.theBeat.snarePitchVal);
    sliderSetValue('hihat_thumb', beatMod.theBeat.hihatPitchVal);
    sliderSetValue('tom1_thumb', beatMod.theBeat.tom1PitchVal);
    sliderSetValue('tom2_thumb', beatMod.theBeat.tom2PitchVal);
    sliderSetValue('tom3_thumb', beatMod.theBeat.tom3PitchVal);
    sliderSetValue('swing_thumb', beatMod.theBeat.swingFactor);

    // Clear out the text area post-processing
    elTextarea.value = '';

    toggleLoadContainer();
    updateControls();
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
    drums.loadBeat(beatMod.beatReset);
}



function sliderSetValue(slider, value) {
    var pitchRate = Math.pow(2.0, 2.0 * (value - 0.5));

    switch(slider) {
    case 'effect_thumb':
        // Change the volume of the convolution effect.
        beatMod.setBeatEffectMix(value);
        drums.setEffectLevel(beatMod.theBeat);
        break;
    case 'kick_thumb':
        beatMod.setBeatKickPitchVal(value);
        kickPitch = pitchRate;
        break;
    case 'snare_thumb':
        beatMod.setBeatSnarePitchVal(value);
        snarePitch = pitchRate;
        break;
    case 'hihat_thumb':
        beatMod.setBeatHihatPitchVal(value);
        hihatPitch = pitchRate;
        break;
    case 'tom1_thumb':
        beatMod.setBeatTom1PitchVal(value);
        tom1Pitch = pitchRate;
        break;
    case 'tom2_thumb':
        beatMod.setBeatTom2PitchVal(value);
        tom2Pitch = pitchRate;
        break;
    case 'tom3_thumb':
        beatMod.setBeatTom3PitchVal(value);
        tom3Pitch = pitchRate;
        break;
    case 'swing_thumb':
        beatMod.setBeatSwingFactor(value);
        break;
    }
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

exports.setTimerWorker = setTimerWorker;
exports.sliderSetValue = sliderSetValue;

// variables
exports.timerWorker = timerWorker;



//
