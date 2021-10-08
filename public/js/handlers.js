const beatManager = require('./beat')
const kit = require('./kit')
const drawer = require('./draw')
const synth = require('./synthesis')
const impulse = require('./impulse')
const play = require('./play')
const slidersManager = require('./sliders')
const context = require('./context')
const init = require('./init')


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
        slidersManager.sliderSetValue(event.target.id, 0.5);
        drawer.updateControls();
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

    slidersManager.sliderSetValue(mouseCapture, value);
    //add code corresponding to new slider val
    synth.synthSliderCode(mouseCapture, value);
}

function handleMouseUp() {
    mouseCapture = null;
}

function handleButtonMouseDown(event) {
    if (init.getStoreState() == 'liveCodingView') {
        //console.log(init.getStoreState());
        return
    }
    var notes = beatManager.theBeat.track1vol;

    var elId = event.target.id;
    var trackIndex = elId.substr(elId.indexOf('_') + 1, 2);
    var instrumentIndex = kit.instruments.indexOf(elId.substr(0, elId.indexOf('_')));

    var notes;
    var durations;
    if (instrumentIndex == 0) {
        durations = beatManager.theBeat.track1dur;
        notes = beatManager.theBeat.track1vol;
    }
    else if (instrumentIndex == 1) {
        durations = beatManager.theBeat.track2dur;
        notes = beatManager.theBeat.track2vol;
    }
    else if (instrumentIndex == 2) {
        durations = beatManager.theBeat.track3dur;
        notes = beatManager.theBeat.track3vol;
    }
    else if (instrumentIndex == 3) {
        durations = beatManager.theBeat.track4dur;
        notes = beatManager.theBeat.track4vol;
    }
    else if (instrumentIndex == 4) {
        durations = beatManager.theBeat.track5dur;
        notes = beatManager.theBeat.track5vol;
    }
    else if (instrumentIndex == 5) {
        durations = beatManager.theBeat.track6dur;
        notes = beatManager.theBeat.track6vol;
    }

    if (event.shiftKey) { //if shift, we are modifying duration
        var newNoteDuration = ((durations[trackIndex]) % 4) + 1;
        durations[trackIndex] = newNoteDuration;
        synth.synthDurationCode(newNoteDuration, trackIndex, instrumentIndex, beatManager.theBeat)
    }
    else { //else vol
        var newNoteValue = (notes[trackIndex] + 1) % 3;
        notes[trackIndex] = newNoteValue;
        synth.synthNoteCode(newNoteValue, trackIndex, instrumentIndex, beatManager.theBeat)

    }
    if (instrumentIndex == currentlyActiveInstrument)
        showCorrectNote(trackIndex, notes[trackIndex]);

    drawer.drawNote(notes[trackIndex], durations[trackIndex], trackIndex, instrumentIndex);

    //plays the note when you click on it
    if (newNoteValue && false) { //commented out, not sure we want to enable
        switch (instrumentIndex) {
            case 0:  // track6
                play.playNote(kit.currentKit.track6Buffer, false, 0, 0, -2, 0.5 * beatManager.theBeat.effectMix, kit.volumes[newNoteValue] * 1.0, kit.track6Pitch, 0, play.getDuration());
                break;

            case 1:  // track5
                play.playNote(kit.currentKit.track5Buffer, false, 0, 0, -2, beatManager.theBeat.effectMix, kit.volumes[newNoteValue] * 0.6, kit.track5Pitch, 0, play.getDuration());
                break;

            case 2:  // track4
                // Pan the track4 according to sequence position.
                play.playNote(kit.currentKit.track4Buffer, true, 0.5 * trackIndex - 4, 0, -1.0, beatManager.theBeat.effectMix, kit.volumes[newNoteValue] * 0.7, kit.track4Pitch, 0, play.getDuration());
                break;

            case 3:  // Tom 1
                play.playNote(kit.currentKit.track1, false, 0, 0, -2, beatManager.theBeat.effectMix, kit.volumes[newNoteValue] * 0.6, kit.track1Pitch, 0, play.getDuration());
                break;

            case 4:  // track2
                play.playNote(kit.currentKit.track2, false, 0, 0, -2, beatManager.theBeat.effectMix, kit.volumes[newNoteValue] * 0.6, kit.track2Pitch, 0, play.getDuration());
                break;

            case 5:  // track3
                play.playNote(kit.currentKit.track3, false, 0, 0, -2, beatManager.theBeat.effectMix, kit.volumes[newNoteValue] * 0.6, kit.track3Pitch, 0, play.getDuration());
                break;
        }
    }

}

function handleKitComboMouseDown(event) {
    document.getElementById('kitcombo').classList.toggle('active');
}

function handleKitMouseDown(event) {
    var index = kit.kitNamePretty.indexOf(event.target.innerHTML);
    beatManager.setBeatKitIndex(index);
    kit.setCurrentKit(kit.kits[index]);
    document.getElementById('kitname').innerHTML = kit.kitNamePretty[index];
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
    for (var i = 0; i < impulse.impulseResponseInfoList.length; ++i) {
        if (impulse.impulseResponseInfoList[i].name == event.target.innerHTML) {
            // Hack - if effect is turned all the way down - turn up effect slider.
            // ... since they just explicitly chose an effect from the list.
            if (beatManager.theBeat.effectMix == 0)
                beatManager.setBeatEffectMix(0.5);

            impulse.setEffect(i);
            drawer.updateControls();
            break;
        }
    }
}

function loadBeat(beat) {
    // Check that assets are loaded.
    if (beat != beatManager.beatReset && !beat.isLoaded())
        return false;

    handleStop();

    beatManager.setBeat(beatManager.cloneBeat(beat));
    kit.setCurrentKit(kit.kits[beatManager.theBeat.kitIndex]);
    impulse.setEffect(beatManager.theBeat.effectIndex);
    drawer.updateControls();

    // apply values from sliders
    slidersManager.sliderSetValue('effect_thumb', beatManager.theBeat.effectMix);
    slidersManager.sliderSetValue('track6_thumb', beatManager.theBeat.track6PitchVal);
    slidersManager.sliderSetValue('track5_thumb', beatManager.theBeat.track5PitchVal);
    slidersManager.sliderSetValue('track4_thumb', beatManager.theBeat.track4PitchVal);
    slidersManager.sliderSetValue('track1_thumb', beatManager.theBeat.track1PitchVal);
    slidersManager.sliderSetValue('track2_thumb', beatManager.theBeat.track2PitchVal);
    slidersManager.sliderSetValue('track3_thumb', beatManager.theBeat.track3PitchVal);
    slidersManager.sliderSetValue('swing_thumb', beatManager.theBeat.swingFactor);

    drawer.updateControls();
    console.log("thebeat handlers", beatManager.theBeat);
    setActiveInstrument(0);

    return true;
}

function handleDemoMouseDown(event) {
    var loaded = false;

    switch (event.target.id) {
        case 'demo1':
            loaded = loadBeat(beatManager.beatDemo[0]);
            break;
        case 'demo2':
            loaded = loadBeat(beatManager.beatDemo[1]);
            break;
        case 'demo3':
            loaded = loadBeat(beatManager.beatDemo[2]);
            break;
        case 'demo4':
            loaded = loadBeat(beatManager.beatDemo[3]);
            break;
        case 'demo5':
            loaded = loadBeat(beatManager.beatDemo[4]);
            break;
    }

    if (loaded)
        handlePlay();
}

function handlePlay(event) {
    play.setNoteTime(0.0);
    beatManager.setStartTime(context.context.currentTime + 0.005);
    play.schedule();
    timerWorker.postMessage("start");

    document.getElementById('play').classList.add('playing');
    document.getElementById('stop').classList.add('playing');
    if (midiOut) {
        // turn off the play button
        midiOut.send([0x80, 3, 32]);
        // light up the stop button
        midiOut.send([0x90, 7, 1]);
    }
}

function handleStop(event) {
    timerWorker.postMessage("stop");

    var elOld = document.getElementById('LED_' + (beatManager.trackIndex + 14) % 16);
    elOld.src = 'images/LED_off.png';

    hideBeat((beatManager.trackIndex + 14) % 16);

    beatManager.settrackIndex(0);

    document.getElementById('play').classList.remove('playing');
    document.getElementById('stop').classList.remove('playing');
    if (midiOut) {
        // light up the play button
        midiOut.send([0x90, 3, 32]);
        // turn off the stop button
        midiOut.send([0x80, 7, 1]);
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
exports.loadBeat = loadBeat;


//
