const beatManager = require('./beat')
const kit = require('./kit')
const contextMod = require('./context')
const drawer = require('./draw')

function updateSliderVals(sliderValObj) {
    Object.entries(sliderValObj).forEach(entry => {
        const [trackEffectName, trackEffectVal] = entry;
        sliderSetValue(trackEffectName, trackEffectVal);
    });
    drawer.updateControls();
}

function sliderSetValue(slider, value) {
    var pitchRate = Math.pow(2.0, 2.0 * (value - 0.5));
    switch (slider) {
        case 'effect_thumb':
            // Change the volume of the convolution effect.
            beatManager.setBeatEffectMix(value);
            contextMod.setEffectLevel(beatManager.theBeat);
            break;
        case 'track6_thumb':
            beatManager.setBeattrack6PitchVal(value);
            kit.settrack6Pitch(pitchRate);
            break;
        case 'track5_thumb':
            beatManager.setBeattrack5PitchVal(value);
            kit.settrack5Pitch(pitchRate);
            break;
        case 'track4_thumb':
            beatManager.setBeattrack4PitchVal(value);
            kit.settrack4Pitch(pitchRate);
            break;
        case 'track1_thumb':
            beatManager.setBeattrack1PitchVal(value);
            kit.settrack1Pitch(pitchRate);
            break;
        case 'track2_thumb':
            beatManager.setBeattrack2PitchVal(value);
            kit.settrack2Pitch(pitchRate);
            break;
        case 'track3_thumb':
            beatManager.setBeattrack3PitchVal(value);
            kit.settrack3Pitch(pitchRate);
            break;
        case 'swing_thumb':
            beatManager.setBeatSwingFactor(value);
            break;
    }
}




// functions
exports.sliderSetValue = sliderSetValue;
exports.updateSliderVals = updateSliderVals;
