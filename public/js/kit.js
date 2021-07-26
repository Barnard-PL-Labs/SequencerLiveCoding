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
    "TheCheebacabra2"
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
    "The Cheebacabra 2"
    ];

function Kit(name) {
    this.name = name;

    this.pathName = function() {
        var pathName = "sounds/drum-samples/" + this.name + "/"; //corresponds to left folder
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
