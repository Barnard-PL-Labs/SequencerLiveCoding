const beatMod = require('./beat')
const kitMod = require('./kit')

const drums = require('./drummachine')

function sliderSetValue(slider, value) {
    var pitchRate = Math.pow(2.0, 2.0 * (value - 0.5));

    switch(slider) {
    case 'effect_thumb':
        // Change the volume of the convolution effect.
        beatMod.setBeatEffectMix(value);
        drums.setEffectLevel(beatMod.theBeat);
        break;
    case 'kick_thumb':
        beatMod.setBeatKickPitchVal(value);
        kitMod.setKickPitch(pitchRate);
        break;
    case 'snare_thumb':
        beatMod.setBeatSnarePitchVal(value);
        kitMod.setSnarePitch(pitchRate);
        break;
    case 'hihat_thumb':
        beatMod.setBeatHihatPitchVal(value);
        kitMod.setHihatPitch(pitchRate);
        break;
    case 'tom1_thumb':
        beatMod.setBeatTom1PitchVal(value);
        kitMod.setTom1Pitch(pitchRate);
        break;
    case 'tom2_thumb':
        beatMod.setBeatTom2PitchVal(value);
        kitMod.setTom2Pitch(pitchRate);
        break;
    case 'tom3_thumb':
        beatMod.setBeatTom3PitchVal(value);
        kitMod.setTom3Pitch(pitchRate);
        break;
    case 'swing_thumb':
        beatMod.setBeatSwingFactor(value);
        break;
    }
}




// functions
exports.sliderSetValue = sliderSetValue;
