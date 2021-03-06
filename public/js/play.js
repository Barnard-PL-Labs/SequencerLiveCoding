const beatManager = require('./beat')
const synth = require('./synthesis')
const drawer = require('./draw')
const kit = require('./kit')
const impulseMod = require('./impulse')
const context = require('./context')
const sliders = require('./sliders')

var noteTime = 0.0;

function setNoteTime(t) {
    noteTime = t;
    exports.noteTime = noteTime;
}

function advanceNote() {

    newData = synth.updatePatternFromCode(beatManager.cloneBeat(beatManager.theBeat), beatManager.rhythmIndex);
    if (newData != null) {
        sliders.updateSliderVals(newData.sliders);
        beatManager.setBeat(newData.beat)
        drawer.redrawAllNotes();
    }
    // Advance time by a 16th note...
    var secondsPerBeat = 60.0 / beatManager.theBeat.tempo;

    beatManager.setRhythmIndex(beatManager.rhythmIndex + 1);
    if (beatManager.rhythmIndex == beatManager.loopLength) {
        beatManager.setRhythmIndex(0);
    }

    // apply swing
    if (beatManager.rhythmIndex % 2) {
        noteTime += (0.25 + beatManager.kMaxSwing * beatManager.theBeat.swingFactor) * secondsPerBeat;
    } else {
        noteTime += (0.25 - beatManager.kMaxSwing * beatManager.theBeat.swingFactor) * secondsPerBeat;
    }
}

function playNote(buffer, pan, x, y, z, sendGain, mainGain, playbackRate, noteTime) {
    // Create the note
    var voice = context.context.createBufferSource();
    voice.buffer = buffer;
    voice.playbackRate.value = playbackRate;

    // Optionally, connect to a panner
    var finalNode;
    if (pan) {
        var panner = context.context.createPanner();
        panner.panningModel = "HRTF";
        panner.setPosition(x, y, z);
        voice.connect(panner);
        finalNode = panner;
    } else {
        finalNode = voice;
    }

    // Connect to dry mix
    var dryGainNode = context.context.createGain();
    dryGainNode.gain.value = mainGain * context.effectDryMix;
    finalNode.connect(dryGainNode);
    context.connectNodes(dryGainNode, context.masterGainNode);

    // Connect to wet mix
    var wetGainNode = context.context.createGain();
    wetGainNode.gain.value = sendGain;
    finalNode.connect(wetGainNode);
    context.connectNodes(wetGainNode, context.convolver);

    voice.start(noteTime);
}

function schedule() {
    var currentTime = context.context.currentTime;

    // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
    currentTime -= beatManager.startTime;

    while (noteTime < currentTime + 0.120) {
        // Convert noteTime to context time.
        var contextPlayTime = noteTime + beatManager.startTime;

        // Kick
        if (beatManager.theBeat.rhythm1[beatManager.rhythmIndex] && instrumentActive[0]) {
            playNote(kit.currentKit.kickBuffer, false, 0, 0, -2, 0.5, kit.volumes[beatManager.theBeat.rhythm1[beatManager.rhythmIndex]] * 1.0, kit.kickPitch, contextPlayTime);
        }

        // Snare
        if (beatManager.theBeat.rhythm2[beatManager.rhythmIndex] && instrumentActive[1]) {
            playNote(kit.currentKit.snareBuffer, false, 0, 0, -2, 1, kit.volumes[beatManager.theBeat.rhythm2[beatManager.rhythmIndex]] * 0.6, kit.snarePitch, contextPlayTime);
        }

        // Hihat
        if (beatManager.theBeat.rhythm3[beatManager.rhythmIndex] && instrumentActive[2]) {
            // Pan the hihat according to sequence position.
            playNote(kit.currentKit.hihatBuffer, true, 0.5 * beatManager.rhythmIndex - 4, 0, -1.0, 1, kit.volumes[beatManager.theBeat.rhythm3[beatManager.rhythmIndex]] * 0.7, kit.hihatPitch, contextPlayTime);
        }

        // Toms
        if (beatManager.theBeat.rhythm4[beatManager.rhythmIndex] && instrumentActive[3]) {
            playNote(kit.currentKit.tom1, false, 0, 0, -2, 1, kit.volumes[beatManager.theBeat.rhythm4[beatManager.rhythmIndex]] * 0.6, kit.tom1Pitch, contextPlayTime);
        }

        if (beatManager.theBeat.rhythm5[beatManager.rhythmIndex] && instrumentActive[4]) {
            playNote(kit.currentKit.tom2, false, 0, 0, -2, 1, kit.volumes[beatManager.theBeat.rhythm5[beatManager.rhythmIndex]] * 0.6, kit.tom2Pitch, contextPlayTime);
        }

        if (beatManager.theBeat.rhythm6[beatManager.rhythmIndex] && instrumentActive[5]) {
            playNote(kit.currentKit.tom3, false, 0, 0, -2, 1, kit.volumes[beatManager.theBeat.rhythm6[beatManager.rhythmIndex]] * 0.6, kit.tom3Pitch, contextPlayTime);
        }


        // Attempt to synchronize drawing time with sound
        if (noteTime != drawer.lastDrawTime) {
            drawer.setLastDrawTime(noteTime);
            drawer.drawPlayhead((beatManager.rhythmIndex + 15) % 16);
        }

        advanceNote();
    }
}

function playDrum(noteNumber, velocity) {
    switch (noteNumber) {
        case 0x24:
            playNote(kit.currentKit.kickBuffer, false, 0, 0, -2, 0.5, (velocity / 127), kit.kickPitch, 0);
            break;
        case 0x26:
            playNote(kit.currentKit.snareBuffer, false, 0, 0, -2, 1, (velocity / 127), kit.snarePitch, 0);
            break;
        case 0x28:
            playNote(kit.currentKit.hihatBuffer, true, 0, 0, -1.0, 1, (velocity / 127), kit.hihatPitch, 0);
            break;
        case 0x2d:
            playNote(kit.currentKit.tom1, false, 0, 0, -2, 1, (velocity / 127), kit.tom1Pitch, 0);
            break;
        case 0x2f:
            playNote(kit.currentKit.tom2, false, 0, 0, -2, 1, (velocity / 127), kit.tom2Pitch, 0);
            break;
        case 0x32:
            playNote(kit.currentKit.tom3, false, 0, 0, -2, 1, (velocity / 127), kit.tom3Pitch, 0);
            break;
        default:
            console.log("note:0x" + noteNumber.toString(16));
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
