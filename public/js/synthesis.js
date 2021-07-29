// const { setBeatSnarePitchVal, setBeatTom2PitchVal, setBeatTom1PitchVal, setBeatHihatPitchVal, setBeatTom3PitchVal} = require("./beat");
// const beatMod = require('./beat')

const instrument = {
    1: "Kick",
    2: "Snare",
    3: "Hi-Hat",
    4: "Tom1",
    5: "Tom2",
    6: "Tom3"
};

//We pull this in on init, which allows us to grab code as the drum machine runs
var codeMirrorInstance = null

function setCMInstance(cm) {
    codeMirrorInstance = cm;
}

function addLineForPointChange(currentCode, newNoteValue, rhythmIndex, instrumentIndex) {
    //generate new line for changed note
    // newLine = "  b.rhythm" + (instrumentIndex + 1) + "[" + rhythmIndex + "] = " + newNoteValue + ";\n"
    // existingLineLoc = currentCode.indexOf("  b.rhythm" + (instrumentIndex + 1) + "[" + rhythmIndex + "] =")
    newLine = "  b." + instrument[instrumentIndex+1] + "[" + rhythmIndex + "] = " + newNoteValue + ";\n"
    existingLineLoc = currentCode.indexOf("  b." + instrument[instrumentIndex+1] + "[" + rhythmIndex + "] =")
    //if code has a line explicitly changed this point, then we update its value
    if (existingLineLoc >= 0) {
        var lineChPos = codeMirrorInstance.posFromIndex(existingLineLoc);
        var endReplacePos = JSON.parse(JSON.stringify(lineChPos));
        endReplacePos.ch = newLine.length + 1;
        codeMirrorInstance
            .replaceRange(newLine.slice(0, -1), lineChPos, endReplacePos);
    }
    //else code currently has no effect on manually changed pattern, so we can just add a line
    else {
        codeMirrorInstance.replaceRange(newLine, { line: codeMirrorInstance.lineCount() - 2, ch: 0 })
    }
    return codeMirrorInstance.getValue();
}

function synthCode(newNoteValue, rhythmIndex, instrumentIndex, theBeat) {
    //get current code
    var currentCode = codeMirrorInstance.getValue()

    var updatedCode = addLineForPointChange(currentCode, newNoteValue, rhythmIndex, instrumentIndex)

    socket.emit('code', { "code": updatedCode, "beat": theBeat });

    // currently, if we get new code any time, we replace code with synthesized code
    // TODO we need something a bit more tasteful - e.g. put new code in a "proposed change" box 
    socket.on('newCode', function (c) {
        codeMirrorInstance.replaceRange(c, { line: 2, ch: 0 }, { line: codeMirrorInstance.lineCount() - 2, ch: 0 });
    });
}

function synthSliderCode(sliderTarget, value) {
    var currentCode = codeMirrorInstance.getValue()
    //generate new line for changed note
    newLine = "  s." + sliderTarget + " = " + "p(" + Math.round((value + Number.EPSILON) * 100) / 100 + ");\n"
    existingLineLoc = currentCode.indexOf("  s." + sliderTarget)
    //if code has a line explicitly changed this point, then we update its value
    if (existingLineLoc >= 0) {
        var lineChPos = codeMirrorInstance.posFromIndex(existingLineLoc);
        var endReplacePos = JSON.parse(JSON.stringify(lineChPos));
        endReplacePos.ch = newLine.length + 1;
        codeMirrorInstance
            .replaceRange(newLine.slice(0, -1), lineChPos, endReplacePos);
    }
    //else code currently has no effect on manually changed pattern, so we can just add a line
    else {
        codeMirrorInstance.replaceRange(newLine, { line: codeMirrorInstance.lineCount() - 2, ch: 0 })
    }
}

function updatePatternFromCode(currentBeat, rhythmIndex) {
    //every time we advance a time step, pull latest code and update beat object
    var updatedCode = codeMirrorInstance.getValue()
    try {
        //TODO if(codeChanged) {
        let f = new Function("theBeat", "rhythmIndex", '"use strict"; ' + pattern.toString() + setAll.toString() + backBeat.toString() + p.toString() + every_beat.toString() + updatedCode + ' return (genBeat(theBeat, {}, rhythmIndex));');
        let newData = f(currentBeat, rhythmIndex);
        let newBeat = newData.beat;
        let newSliders = newData.sliders;
        for (i = 1; i <= 6; i++) {
            newBeat['rhythm' + i.toString()] = newBeat['rhythm' + i.toString()].map((note) => { if (Number.isNaN(note)) { return 0; } else { return note } });
            newBeat[instrument[i]] = newBeat[instrument[i]].map((note) => { if (Number.isNaN(note)) { return 0; } else { return note } });
        }
        if (isValidBeat(newBeat) && isValidSliders(newSliders)) { // && theBeat != newBeat){
            return { beat: newBeat, sliders: newSliders };
        }
    }
    catch (err) {
        console.log("updatePatternFromCode error")
        console.log(err)
    }
    return null;
}

//function that creates new beat with equation as only input
function pattern(equation){
     return new Array(16).fill(0).map(equation);
}

function setAll(val){
    if(val>=0 && val<=2)
        return new Array(16).fill(val);
}

function p(val){
    const notes = {
        "C": 0,
        "D": 0.167,
        "E": 0.333,
        "F": 0.5,
        "G": 0.667,
        "A": 0.833,
        "B": 1
    };
    if(isNaN(val)){
        if(val.match(/[A-G]/g))
            val = notes[val];
        else
            val = 0;
    }else{
        val = val%1;
    }   
    console.log("pitchVal: " + val);
    return val;
}


function backBeat(){
    return new Array(16).fill(0).map((val,i) => i%2);
}

function every_beat(val, noteVal){
    let res = new Array(16).fill(0);
    for(i=0; i<res.length; i+=val){
        res[i] = noteVal;
    }
    return res;
}

function isValidBeat(beat) {
    var valid = true;
    for (i = 1; i <= 6; i++) {
        valid = valid &&
            Array.isArray(beat['rhythm' + i.toString()]) &&
            beat['rhythm' + i.toString()].every((v) => v <= 2 && v >= 0);
            // Array.isArray(beat[instrument[i]]) &&
            // beat[instrument[i]].every((v) => v <= 2 && v >= 0);
    }
    return valid;
}

function isValidSliders(sliders) {
    var valid = true;
    Object.values(sliders).forEach(val => {
        valid = valid &&
            typeof val == 'number' &&
            val >= 0 && val <= 1
    });
    console.log("Slider: " + valid)
    return valid;
}


exports.setCMInstance = setCMInstance
exports.synthCode = synthCode
exports.synthSliderCode = synthSliderCode
exports.updatePatternFromCode = updatePatternFromCode

//
