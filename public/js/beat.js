
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
    {
        "kitIndex": 13, "effectIndex": 18, "tempo": 120, "swingFactor": 0, "effectMix": 0.19718309859154926,
        "track6PitchVal": 0.5, "track5PitchVal": 0.5, "track4PitchVal": 0.5, "track1PitchVal": 0.5, "track2PitchVal": 0.5, "track3PitchVal": 0.5,
        "track1vol": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], "track2vol": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], "track3vol": [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], "track4vol": [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], "track5vol": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], "track6vol": zeros(),
        "track1dur": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], "track2dur": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], "track3dur": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], "track4dur": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], "track5dur": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], "track6dur": zeros()
    },
    {
        "kitIndex": 4, "effectIndex": 12, "tempo": 100, "swingFactor": 0, "effectMix": 0.2,
        "track6PitchVal": 0.46478873239436624, "track5PitchVal": 0.45070422535211263, "track4PitchVal": 0.15492957746478875, "track1PitchVal": 0.7183098591549295, "track2PitchVal": 0.704225352112676, "track3PitchVal": 0.8028169014084507,
        "track1vol": zeros(), "track2vol": zeros(), "track3vol": zeros(), "track4vol": zeros(), "track5vol": zeros(), "track6vol": zeros(),
        "track1dur": ones(), "track2dur": ones(), "track3dur": ones(), "track4dur": ones(), "track5dur": ones(), "track6dur": ones()
    },
    //{"kitIndex":0,"effectIndex":5,"tempo":100,"swingFactor":0,"effectMix":0.25,"track6PitchVal":0.5,"track5PitchVal":0.5,"track4PitchVal":0.5211267605633803,"track1PitchVal":0.23943661971830987,"track2PitchVal":0.21126760563380287,"track3PitchVal":0.2535211267605634,"track1vol":[2,0,0,0,2,0,0,0,2,0,0,0,2,0,0,0],"track2vol":[0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0],"track3vol":[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],"track4vol":[1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],"track5vol":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],"track6vol":[0,0,1,0,1,0,0,2,0,2,0,0,1,0,0,0], "track1dur":[12,0,0,0,12,0,0,0,12,0,0,0,12,0,0,0],"track2dur":[0,0,0,0,12,0,0,0,0,0,0,0,12,0,0,0],"track3dur":[0,0,12,0,0,0,12,0,0,0,12,0,0,0,12,0],"track4dur":[12,12,0,1,1,1,0,1,1,1,0,1,1,1,0,1],"track5dur":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0],"track6dur":[0,0,1,0,1,0,0,2,0,2,0,0,1,0,0,0]},
    {
        "kitIndex": 0, "effectIndex": 5, "tempo": 100, "swingFactor": 0, "effectMix": 0.25,
        "track6PitchVal": 0.5, "track5PitchVal": 0.5, "track4PitchVal": 0.5211267605633803, "track1PitchVal": 0.23943661971830987, "track2PitchVal": 0.21126760563380287,
        "track3PitchVal": 0.2535211267605634, "track1vol": zeros(), "track2vol": zeros(), "track3vol": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], "track4vol": zeros(), "track5vol": zeros(), "track6vol": zeros(),
        "track1dur": ones(), "track2dur": ones(), "track3dur": [1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1], "track4dur": ones(), "track5dur": ones(), "track6dur": ones()
    },
    {
        "kitIndex": 1, "effectIndex": 4, "tempo": 120, "swingFactor": 0, "effectMix": 0.25,
        "track6PitchVal": 0.7887323943661972, "track5PitchVal": 0.49295774647887325, "track4PitchVal": 0.5, "track1PitchVal": 0.323943661971831, "track2PitchVal": 0.3943661971830986, "track3PitchVal": 0.323943661971831,
        "track1vol": [2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1], "track2vol": zeros(), "track3vol": [0, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 2, 0], "track4vol": [2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0], "track5vol": [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "track6vol": [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
        "track1dur": [2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1], "track2dur": zeros(), "track3dur": [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1], "track4dur": [2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1], "track5dur": [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], "track6dur": [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]
    },
    {
        "kitIndex": 2, "effectIndex": 1, "tempo": 60, "swingFactor": 0.5419847328244275, "effectMix": 0.25,
        "track6PitchVal": 0.5, "track5PitchVal": 0.5, "track4PitchVal": 0.5, "track1PitchVal": 0.5, "track2PitchVal": 0.5, "track3PitchVal": 0.5,
        "track1vol": [2, 2, 0, 1, 2, 2, 0, 1, 2, 2, 0, 1, 2, 2, 0, 1], "track2vol": [0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0], "track3vol": [2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1], "track4vol": zeros(), "track5vol": [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0], "track6vol": [1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0],
        "track1dur": [2, 2, 0, 1, 2, 2, 0, 1, 2, 2, 0, 1, 2, 2, 0, 1], "track2dur": [0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0], "track3dur": [2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1], "track4dur": zeros(), "track5dur": [0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0], "track6dur": [1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0]
    },
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
