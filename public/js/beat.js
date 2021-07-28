
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

var beatReset = {"kitIndex":0,"effectIndex":0,"tempo":100,"swingFactor":0,"effectMix":0.25,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5,"tom1PitchVal":0.5,"tom2PitchVal":0.5,"tom3PitchVal":0.5,"rhythm1":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm2":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm3":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm4":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm5":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm6":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm1duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm2duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm3duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm4duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm5duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm6duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};
var beatDemo = [ 
    {"kitIndex":13,"effectIndex":18,"tempo":120,"swingFactor":0,"effectMix":0.19718309859154926,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5,"tom1PitchVal":0.5,"tom2PitchVal":0.5,"tom3PitchVal":0.5,"rhythm1":[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],"rhythm2":[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],"rhythm3":[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],"rhythm4":[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],"rhythm5":[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],"rhythm6":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm1duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm2duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm3duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm4duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm5duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm6duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, 
    {"kitIndex":4,"effectIndex":12,"tempo":100,"swingFactor":0,"effectMix":0.2,"kickPitchVal":0.46478873239436624,"snarePitchVal":0.45070422535211263,"hihatPitchVal":0.15492957746478875,"tom1PitchVal":0.7183098591549295,"tom2PitchVal":0.704225352112676,"tom3PitchVal":0.8028169014084507,"rhythm1":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm2":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm3":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm4":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm5":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm6":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm1duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm2duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm3duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm4duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm5duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "rhythm6duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
    {"kitIndex":2,"effectIndex":5,"tempo":100,"swingFactor":0,"effectMix":0.25,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5211267605633803,"tom1PitchVal":0.23943661971830987,"tom2PitchVal":0.21126760563380287,"tom3PitchVal":0.2535211267605634,"rhythm1":[2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0],"rhythm2":[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0],"rhythm3":[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],"rhythm4":[1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],"rhythm5":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],"rhythm6":[0,0,1,0,1,0,0,2,0,2,0,0,1,0,0,0], "rhythm1duration":[2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0],"rhythm2duration":[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0],"rhythm3duration":[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],"rhythm4duration":[1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],"rhythm5duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],"rhythm6duration":[0,0,1,0,1,0,0,2,0,2,0,0,1,0,0,0]},
    {"kitIndex":1,"effectIndex":4,"tempo":120,"swingFactor":0,"effectMix":0.25,"kickPitchVal":0.7887323943661972,"snarePitchVal":0.49295774647887325,"hihatPitchVal":0.5,"tom1PitchVal":0.323943661971831,"tom2PitchVal":0.3943661971830986,"tom3PitchVal":0.323943661971831,"rhythm1":[2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1],"rhythm2":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm3":[0,0,1,0,2,0,1,0,1,0,1,0,2,0,2,0],"rhythm4":[2,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0],"rhythm5":[0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm6":[0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0], "rhythm1duration":[2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1],"rhythm2duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm3duration":[0,0,1,0,2,0,1,0,1,0,1,0,2,0,2,0],"rhythm4duration":[2,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0],"rhythm5":[0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm6":[0,2,0,0,0,2,0,0,0,2,0,0,0,0,0,0]},
    {"kitIndex":0,"effectIndex":1,"tempo":60,"swingFactor":0.5419847328244275,"effectMix":0.25,"kickPitchVal":0.5,"snarePitchVal":0.5,"hihatPitchVal":0.5,"tom1PitchVal":0.5,"tom2PitchVal":0.5,"tom3PitchVal":0.5,"rhythm1":[2,2,0,1,2,2,0,1,2,2,0,1,2,2,0,1],"rhythm2":[0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],"rhythm3":[2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1],"rhythm4":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm5":[0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0],"rhythm6":[1,0,0,1,0,1,0,1,1,0,0,1,1,1,1,0], "rhythm1duration":[2,2,0,1,2,2,0,1,2,2,0,1,2,2,0,1],"rhythm2duration":[0,0,2,0,0,0,2,0,0,0,2,0,0,0,2,0],"rhythm3duration":[2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1],"rhythm4duration":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"rhythm5duration":[0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0],"rhythm6duration":[1,0,0,1,0,1,0,1,1,0,0,1,1,1,1,0]},
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
    beat.rhythm1durration = source.rhythm1duration.slice(0);        // slice(0) is an easy way to copy the full array
    beat.rhythm2duration = source.rhythm2duration.slice(0);
    beat.rhythm3duration = source.rhythm3duration.slice(0);
    beat.rhythm4duration = source.rhythm4duration.slice(0);
    beat.rhythm5duration = source.rhythm5duration.slice(0);
    beat.rhythm6duration = source.rhythm6duration.slice(0);

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
