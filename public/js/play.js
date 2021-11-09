const beatManager = require('./beat')
const synth = require('./synthesis')
const drawer = require('./draw')
const kit = require('./kit')
const impulseMod = require('./impulse')
const context = require('./context')
const sliders = require('./sliders')

var noteTime = 0.0;

var globalTime = 0;

function setNoteTime(t) {
    noteTime = t;
    exports.noteTime = noteTime;
}

function secondsPerBeat() {
    var secondsPerBeat = 60.0 / beatManager.theBeat.tempo;
    return secondsPerBeat;
}

function advanceNote() {

    //TODO should we be passing beat reset here instead so that we ensure the code window always reflects the gui?
    //does doing this mean we cannot have a gui that has state that the code does not?
    newData = synth.updatePatternFromCode(beatManager.cloneBeat(beatManager.beatReset), beatManager.trackIndex, globalTime);
    globalTime += 1;
    if (newData != null) {
        //TODO merge all updates
        sliders.updateSliderVals(newData.sliders);
        beatManager.setBeat(newData.beat)
        beatManager.setBeatKitIndex(newData.beat.kitIndex)
        kit.setCurrentKit(kit.kits[newData.beat.kitIndex]);

        drawer.redrawAllNotes();
    }

    beatManager.settrackIndex(beatManager.trackIndex + 1);
    if (beatManager.trackIndex == beatManager.loopLength) {
        beatManager.settrackIndex(0);
    }

    // apply swing
    if (beatManager.trackIndex % 2) {
        // Advance time by a 16th note...
        noteTime += (0.25 + beatManager.kMaxSwing * beatManager.theBeat.swingFactor) * secondsPerBeat();
    } else {
        noteTime += (0.25 - beatManager.kMaxSwing * beatManager.theBeat.swingFactor) * secondsPerBeat();
    }
}

function playNote(buffer, pan, x, y, z, sendGain, mainGain, playbackRate, noteTime, durationVal) {

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
    voice.stop(noteTime + (durationVal * secondsPerBeat() * 0.25));
}

var durationTrue;

function getDuration() {
    return 1;
}

var dur = getDuration();

function schedule() {
    var currentTime = context.context.currentTime;

    // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
    currentTime -= beatManager.startTime;

    console.log(kit.currentKit)
    while (noteTime < currentTime + 0.120) {
        // Convert noteTime to context time.
        var contextPlayTime = noteTime + beatManager.startTime;

        // Toms
        if (beatManager.theBeat.track1vol[beatManager.trackIndex] && instrumentActive[0]) {
            playNote(kit.currentKit.track1, false, 0, 0, -2, 1, kit.volumes[beatManager.theBeat.track1vol[beatManager.trackIndex]] * 0.6, kit.track1Pitch, contextPlayTime, beatManager.theBeat.track1dur[beatManager.trackIndex]);
        }

        if (beatManager.theBeat.track2vol[beatManager.trackIndex] && instrumentActive[1]) {
            playNote(kit.currentKit.track2, false, 0, 0, -2, 1, kit.volumes[beatManager.theBeat.track2vol[beatManager.trackIndex]] * 0.6, kit.track2Pitch, contextPlayTime, beatManager.theBeat.track2dur[beatManager.trackIndex]);
        }

        if (beatManager.theBeat.track3vol[beatManager.trackIndex] && instrumentActive[2]) {
            playNote(kit.currentKit.track3, false, 0, 0, -2, 1, kit.volumes[beatManager.theBeat.track3vol[beatManager.trackIndex]] * 0.6, kit.track3Pitch, contextPlayTime, beatManager.theBeat.track3dur[beatManager.trackIndex]);
        }
        // track4
        if (beatManager.theBeat.track4vol[beatManager.trackIndex] && instrumentActive[3]) {
            // Pan the track4 according to sequence position.
            playNote(kit.currentKit.track4Buffer, true, 0.5 * beatManager.trackIndex - 4, 0, -1.0, 1, kit.volumes[beatManager.theBeat.track4vol[beatManager.trackIndex]] * 0.7, kit.track4Pitch, contextPlayTime, beatManager.theBeat.track3dur[beatManager.trackIndex]);
        }

        // track5
        if (beatManager.theBeat.track5vol[beatManager.trackIndex] && instrumentActive[4]) {
            playNote(kit.currentKit.track5Buffer, false, 0, 0, -2, 1, kit.volumes[beatManager.theBeat.track5vol[beatManager.trackIndex]] * 0.6, kit.track5Pitch, contextPlayTime, beatManager.theBeat.track5dur[beatManager.trackIndex]);
        }

        // track6
        if (beatManager.theBeat.track6vol[beatManager.trackIndex] && instrumentActive[5]) { //track6
            playNote(kit.currentKit.track6Buffer, false, 0, 0, -2, 0.5, kit.volumes[beatManager.theBeat.track6vol[beatManager.trackIndex]] * 1.0, kit.track6Pitch, contextPlayTime, beatManager.theBeat.track6dur[beatManager.trackIndex]);
        }

        // Attempt to synchronize drawing time with sound
        if (noteTime != drawer.lastDrawTime) {
            drawer.setLastDrawTime(noteTime);
            drawer.drawPlayhead((beatManager.trackIndex + 15) % 16);
        }

        advanceNote();
    }
}

function playDrum(noteNumber, velocity) {
    switch (noteNumber) {
        case 0x24:
            playNote(kit.currentKit.track6Buffer, false, 0, 0, -2, 0.5, (velocity / 127), kit.track6Pitch, 0, dur);
            break;
        case 0x26:
            playNote(kit.currentKit.track5Buffer, false, 0, 0, -2, 1, (velocity / 127), kit.track5Pitch, 0, dur);
            break;
        case 0x28:
            playNote(kit.currentKit.track4Buffer, true, 0, 0, -1.0, 1, (velocity / 127), kit.track4Pitch, 0, dur);
            break;
        case 0x2d:
            playNote(kit.currentKit.track1, false, 0, 0, -2, 1, (velocity / 127), kit.track1Pitch, 0, dur);
            break;
        case 0x2f:
            playNote(kit.currentKit.track2, false, 0, 0, -2, 1, (velocity / 127), kit.track2Pitch, 0, dur);
            break;
        case 0x32:
            playNote(kit.currentKit.track3, false, 0, 0, -2, 1, (velocity / 127), kit.track3Pitch, 0, dur);
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
exports.getDuration = getDuration;


//
