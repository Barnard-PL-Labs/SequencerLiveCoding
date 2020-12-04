const beatMod = require('./beat')

var context;
var convolver;
var compressor;
var masterGainNode;
var effectLevelNode;
var filterNode;


// Each effect impulse response has a specific overall desired dry and wet volume.
// For example in the telephone filter, it's necessary to make the dry volume 0 to correctly hear the effect.
var effectDryMix = 1.0;
var effectWetMix = 1.0;

function setEffectDryMix(m) {
  effectDryMix = m;
  exports.effectDryMix = effectDryMix;
}

function setEffectWetMix(m) {
  effectWetMix = m;
  exports.effectWetMix = effectWetMix;
}


function setContext (c) {
  context = c;
  exports.context = context;
}

function setConvolver (n) {
  convolver = n;
  exports.convolver = convolver;
}

function setCompressor (n) {
  compressor = n;
  exports.compressor = compressor;
}

function setMasterGainNode (n) {
  masterGainNode = n;
  exports.masterGainNode = masterGainNode;
}

function setEffectLevelNode (n) {
  effectLevelNode = n;
  exports.effectLevelNode = effectLevelNode;
}

function setFilterNode (n) {
  filterNode = n;
  exports.filterNode = filterNode;
}

function filterFrequencyFromCutoff( cutoff ) {
    var nyquist = 0.5 * context.sampleRate;

    // spreads over a ~ten-octave range, from 20Hz - 20kHz.
    var filterFrequency = Math.pow(2, (11 * cutoff)) * 40;

    if (filterFrequency > nyquist)
        filterFrequency = nyquist;
    return filterFrequency;
}

function setFilterCutoff( cutoff ) {
    if (filterNode){
        filterNode.frequency.value = filterFrequencyFromCutoff( cutoff );
        exports.filterNode = filterNode;
    }
}

function setFilterQ( Q ) {
    if (filterNode){
        filterNode.Q.value = Q;
        exports.filterNode = filterNode;
    }
}


function setEffectLevel() {
    // Factor in both the preset's effect level and the blending level (effectWetMix) stored in the effect itself.
    effectLevelNode.gain.value = beatMod.theBeat.effectMix * effectWetMix;
    exports.effectLevelNode = effectLevelNode;
}

function setConvolverBuffer (b) {
  convolver.buffer = b;
  exports.convolver = convolver;
}

function connectNodes(n1, n2) {
  n1.connect(n2);

  // This is probably an ugly way to do it, I just want to be
  // everything is covered
  exports.context = context;
  exports.convolver = convolver;
  exports.compressor = compressor;
  exports.masterGainNode = masterGainNode;
  exports.effectLevelNode = effectLevelNode;
  exports.filterNode = filterNode;
}





// functions

exports.setContext = setContext;
exports.setConvolver = setConvolver;
exports.setCompressor = setCompressor;
exports.setMasterGainNode = setMasterGainNode;
exports.setEffectLevelNode = setEffectLevelNode;
exports.setFilterNode = setFilterNode;

exports.filterFrequencyFromCutoff = filterFrequencyFromCutoff;
exports.setFilterCutoff = setFilterCutoff;
exports.setFilterQ = setFilterQ;

exports.setEffectDryMix = setEffectDryMix;
exports.setEffectWetMix = setEffectWetMix;
exports.setEffectLevel = setEffectLevel;
exports.setConvolverBuffer = setConvolverBuffer;


exports.connectNodes = connectNodes;






// variables
exports.context = context;
exports.convolver = convolver;
exports.compressor = compressor;
exports.masterGainNode = masterGainNode;
exports.effectLevelNode = effectLevelNode;
exports.filterNode = filterNode;

exports.effectDryMix = effectDryMix;
exports.effectWetMix = effectWetMix;







//
