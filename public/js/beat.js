
var kMinTempo = 53;
var kMaxTempo = 180;

var kMaxSwing = .08;

var startTime;

function setStartTime(t) {
    startTime = t;
    exports.startTime = startTime;
}


var loopLength = 16;
var trackIndex = 0;
function settrackIndex(idx) {
    trackIndex = idx;
    exports.trackIndex = trackIndex;
}

var beatReset = {
    "kitIndex": 0, "effectIndex": 0, "tempo": 100, "swingFactor": 0, "effectMix": 0.25, "track6PitchVal": 0.5, "track5PitchVal": 0.5, "track4PitchVal": 0.5, "track1PitchVal": 0.5, "track2PitchVal": 0.5, "track3PitchVal": 0.5,
    "track1vol": zeros(),
    "track2vol": zeros(),
    "track3vol": zeros(),
    "track4vol": zeros(),
    "track5vol": zeros(),
    "track6vol": zeros(),
    "track1dur": ones(),
    "track2dur": ones(),
    "track3dur": ones(),
    "track4dur": ones(),
    "track5dur": ones(),
    "track6dur": ones()
};
var beatDemo = [

`  b.track1vol = new Array(16).fill(1)
  b.track1vol[0] = 2;
  b.kitIndex = 3;
`
    ,
`  b.track1vol = pattern((val,i) => 1 - (i % 3));
  b.track1vol.splice(7,9,...Array(9).fill(1));
  b.track1dur[9] = 1;
  b.track1dur[10] = 2;
  b.track6dur[4] = 2;
  b.track6vol = pattern((val,i) => 1 % (2 - (i % 2)));
  b.track6vol.splice(13,3,...Array(3).fill(0));
  b.track6dur[12] = 2;
  b.track3vol = pattern((val,i) => 1 % (4 - (i % 4)));
  //b.track3vol.splice(9,7,...Array(7).fill(0));
  b.kitIndex = 4;
`
    ,
`  b.track1vol = new Array(16).fill(0)
  b.track1vol[0] = 1;
`
    ,
`  b.track1vol = new Array(16).fill(0)
  b.track1vol[0] = 1;
`
    ,
`  b.track1vol = new Array(16).fill(0)
  b.track1vol[0] = 1;
`
    ,
];


function ones() {
    return new Array(16).fill(1);
}

function zeros() {
    return new Array(16).fill(0);
}

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

    beat.track1dur = source.track1dur.slice(0);        // slice(0) is an easy way to copy the full array
    beat.track2dur = source.track2dur.slice(0);
    beat.track3dur = source.track3dur.slice(0);
    beat.track4dur = source.track4dur.slice(0);
    beat.track5dur = source.track5dur.slice(0);
    beat.track6dur = source.track6dur.slice(0);

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

function setBeatKitIndex(index) {
    theBeat.kitIndex = index;
    exports.theBeat = theBeat
}

function setBeatEffectIndex(index) {
    theBeat.effectIndex = index;
    exports.theBeat = theBeat
}





function tempoIncrease() {
    theBeat.tempo = Math.min(kMaxTempo, theBeat.tempo + 4);
    document.getElementById('tempo').innerHTML = theBeat.tempo;
    exports.theBeat = theBeat
}

function tempoDecrease() {
    theBeat.tempo = Math.max(kMinTempo, theBeat.tempo - 4);
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
