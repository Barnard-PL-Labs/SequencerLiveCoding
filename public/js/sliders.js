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
        case 'kick_thumb':
            beatManager.setBeatKickPitchVal(value);
            kit.setKickPitch(pitchRate);
            break;
        case 'snare_thumb':
            beatManager.setBeatSnarePitchVal(value);
            kit.setSnarePitch(pitchRate);
            break;
        case 'hihat_thumb':
            beatManager.setBeatHihatPitchVal(value);
            kit.setHihatPitch(pitchRate);
            break;
        case 'tom1_thumb':
            beatManager.setBeatTom1PitchVal(value);
            kit.setTom1Pitch(pitchRate);
            break;
        case 'tom2_thumb':
            beatManager.setBeatTom2PitchVal(value);
            kit.setTom2Pitch(pitchRate);
            break;
        case 'tom3_thumb':
            beatManager.setBeatTom3PitchVal(value);
            kit.setTom3Pitch(pitchRate);
            break;
        case 'swing_thumb':
            beatManager.setBeatSwingFactor(value);
            break;
    }
}




// functions
exports.sliderSetValue = sliderSetValue;
exports.updateSliderVals = updateSliderVals;
