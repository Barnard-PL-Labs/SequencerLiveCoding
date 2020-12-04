const kitMod = require('./kit')
const beatMod = require('./beat')

var lastDrawTime = -1;

function setLastDrawTime(time) {
    lastDrawTime = time;
    exports.lastDrawTime = lastDrawTime
}


function drawNote(draw, xindex, yindex) {
    var elButton = document.getElementById(kitMod.instruments[yindex] + '_' + xindex);
    switch (draw) {
        case 0: elButton.src = 'images/button_off.png'; break;
        case 1: elButton.src = 'images/button_half.png'; break;
        case 2: elButton.src = 'images/button_on.png'; break;
    }
}

function redrawAllNotes() {
    for (y = 0; y < 6; y++) { //6 rhythm patterns in theBeat
        for (x = 0; x < 16; x++)  { //16 beat subdivisions
            if(x >= beatMod.theBeat['rhythm'+(y+1).toString()].length){
                drawNote(0, x, y);
            }
            else {
                drawNote(beatMod.theBeat['rhythm'+(y+1).toString()][x], x, y);
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


// functions
exports.drawNote = drawNote;
exports.redrawAllNotes = redrawAllNotes;
exports.drawPlayhead = drawPlayhead;
exports.setLastDrawTime = setLastDrawTime;
exports.sliderSetPosition = sliderSetPosition;

// variables
exports.lastDrawTime = lastDrawTime;


//
