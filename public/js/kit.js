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

var instruments = ['track1', 'track2', 'track3', 'track4', 'track5', 'track6' ];


var volumes = [0, 0.3, 1];

// var kitCount = 0;

var kitName = [ //backend
    "astrobeats",
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
    "TheCheebacabra2",
    "vocal_cymatics"
    ];

var kitNamePretty = [ //interface
    "astrobeats",
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
    "The Cheebacabra 2",
    "vocal_cymatics"
    ];

function Kit(name) {
    this.name = name;

    this.pathName = function() {
        var pathName = "sounds/drum-samples/" + this.name + "/"; //corresponds to left folder
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

    var track1Path = pathName + "tom1.wav";
    var track2Path = pathName + "tom2.wav";
    var track3Path = pathName + "tom3.wav";
    var track4Path = pathName + "hihat.wav";
    var track5Path = pathName + "snare.wav";
    var track6Path = pathName + "kick.wav";


    this.loadSample(0, track1Path, false);
    this.loadSample(1, track2Path, false);
    this.loadSample(2, track3Path, true);  // we're panning only the track4
    this.loadSample(3, track4Path, false);
    this.loadSample(4, track5Path, false);
    this.loadSample(5, track6Path, false);
}

var decodedFunctions = [
function (buffer) { this.track1 = buffer; },
function (buffer) { this.track2 = buffer; },
function (buffer) { this.track3 = buffer; },
function (buffer) { this.track4Buffer = buffer; },
function (buffer) { this.track5Buffer = buffer; },
function (buffer) { this.track6Buffer = buffer; } ];

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
