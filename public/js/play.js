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

    synthMod.updatePatternFromCode();

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
