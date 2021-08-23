const beatMod = require('./beat')
const kitMod = require('./kit')
const impulseMod = require('./impulse')



var lastDrawTime = -1;

function setLastDrawTime(time) {
    lastDrawTime = time;
    exports.lastDrawTime = lastDrawTime
}


function drawNote(volume, duration, xindex, yindex) {
    var elButton = document.getElementById(kitMod.instruments[yindex] + '_' + xindex);
    var button_name = "images/buttons/button_v" + volume + "_d" + duration + ".png"
    elButton.src = button_name;
}

function redrawAllNotes() {
    for (y = 0; y < 6; y++) { //6 track patterns in theBeat
        for (x = 0; x < 16; x++)  { //16 beat subdivisions
            if(x >= beatMod.theBeat['track'+(y+1).toString() + 'vol'].length){
                drawNote(0, 0, x, y);
            }
            else {
                drawNote(beatMod.theBeat['track'+(y+1).toString() + 'vol'][x], beatMod.theBeat['track'+(y+1).toString()+'dur'][x], x, y);
            }
        }
    }
}

function drawPlayhead(xindex) {
    var lastIndex = (xindex + 15) % 16;

    var elNew = document.getElementById('LED_' + xindex);
    var elOld = document.getElementById('LED_' + lastIndex);

    elNew.src = 'images/LED_on.png';
    elOld.src = 'images/LED_off.png';

    hideBeat( lastIndex );
    showBeat( xindex );
}

function sliderSetPosition(slider, value) {
    var elThumb = document.getElementById(slider);
    var elTrack = elThumb.parentNode;

    if (slider == 'swing_thumb') {
        var thumbW = elThumb.clientWidth;
        var trackW = elTrack.clientWidth;
        var travelW = trackW - thumbW;

        elThumb.style.left = travelW * value + 'px';
    } else {
        var thumbH = elThumb.clientHeight;
        var trackH = elTrack.clientHeight;
        var travelH = trackH - thumbH;

        elThumb.style.top = travelH * (1.0 - value) + 'px';
    }
}

function updateControls() {
    for (i = 0; i < beatMod.loopLength; ++i) {
        for (j = 0; j < kitMod.kNumInstruments; j++) {
            //switch (j) {
                if(j == 0) {
                notes = beatMod.theBeat.track1vol; 
                durations = beatMod.theBeat.track1dur; break;
                }
                if(j == 1) {
                notes = beatMod.theBeat.track2vol; 
                durations = beatMod.theBeat.track2dur; break;
                }
                if(j == 2) {
                notes = beatMod.theBeat.track3vol; 
                durations = beatMod.theBeat.track3dur; break;
                }
                if(j == 3) {
                notes = beatMod.theBeat.track4vol; 
                durations = beatMod.theBeat.track4dur; break;
                }
                if(j == 4){
                notes = beatMod.theBeat.track5vol; 
                durations = beatMod.theBeat.track5dur; break;
                }
                //case 5:
                if(j == 5){ 
                notes = beatMod.theBeat.track6vol; 
                durations = beatMod.theBeat.track6dur; break;
                }
            }
            drawNote(notes[i], durations[i], i, j);
        //}
    }

    document.getElementById('kitname').innerHTML = kitMod.kitNamePretty[beatMod.theBeat.kitIndex];
    document.getElementById('effectname').innerHTML = impulseMod.impulseResponseInfoList[beatMod.theBeat.effectIndex].name;
    document.getElementById('tempo').innerHTML = beatMod.theBeat.tempo;
    sliderSetPosition('swing_thumb', beatMod.theBeat.swingFactor);
    sliderSetPosition('effect_thumb', beatMod.theBeat.effectMix);
    sliderSetPosition('track6_thumb', beatMod.theBeat.track6PitchVal);
    sliderSetPosition('track5_thumb', beatMod.theBeat.track5PitchVal);
    sliderSetPosition('track4_thumb', beatMod.theBeat.track4PitchVal);
    sliderSetPosition('track1_thumb', beatMod.theBeat.track1PitchVal);
    sliderSetPosition('track2_thumb', beatMod.theBeat.track2PitchVal);
    sliderSetPosition('track3_thumb', beatMod.theBeat.track3PitchVal);
}


// functions
exports.drawNote = drawNote;
exports.redrawAllNotes = redrawAllNotes;
exports.drawPlayhead = drawPlayhead;
exports.setLastDrawTime = setLastDrawTime;
exports.sliderSetPosition = sliderSetPosition;
exports.updateControls = updateControls;

// variables
exports.lastDrawTime = lastDrawTime;


//
