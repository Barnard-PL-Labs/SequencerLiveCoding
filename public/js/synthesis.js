//We pull this in on init, which allows us to grab code as the drum machine runs
var codeMirrorInstance = null

function setCMInstance(cm) {
    codeMirrorInstance = cm;
}

function synthNoteCode(newValue, trackIndex, instrumentIndex, theBeat) {
    synthCode(false, newValue, trackIndex, instrumentIndex, theBeat) 
}
function synthDurationCode(newDurationValue, trackIndex, instrumentIndex, theBeat) {
    synthCode(true, newDurationValue, trackIndex, instrumentIndex, theBeat) 
}

function synthCode(isNewDuration, newValue, trackIndex, instrumentIndex, theBeat) {
    //get current code
    var currentCode = codeMirrorInstance.getValue()

    if (isNewDuration) {
        var updatedCode = addLineForPointChangeDuration(currentCode, newValue, trackIndex, instrumentIndex)
    }
    else {
        var updatedCode = addLineForPointChangeVolume(currentCode, newValue, trackIndex, instrumentIndex)
        initiateServerSideSynthesis(updatedCode, theBeat)
    }

}

function initiateServerSideSynthesis(updatedCode, theBeat) {
    socket.emit('code', { "code": updatedCode, "beat": theBeat });
    // currently, if we get new code any time, we replace code with synthesized code
    // TODO we need something a bit more tasteful - e.g. put new code in a "proposed change" box 
    socket.on('newCode', function (c) {
        codeMirrorInstance.replaceRange(c, { line: 2, ch: 0 }, { line: codeMirrorInstance.lineCount() - 2, ch: 0 });
    });
}

function addLineForPointChangeDuration(currentCode, newDurationValue, trackIndex, instrumentIndex) {
    //generate new line for changed note
    //TODO this is currently whitespace dependent - make this a regex to give a bit of flexibility at least
    newLine = "  b.track" + (instrumentIndex + 1) + "dur[" + trackIndex + "] = " + newDurationValue + ";\n"
    existingLineLoc = currentCode.indexOf("  b.track" + (instrumentIndex + 1) + "dur[" + trackIndex + "] =")
    return replaceCode(existingLineLoc, newLine);
}

function addLineForPointChangeVolume(currentCode, newNoteValue, trackIndex, instrumentIndex) {
    //generate new line for changed note
    //TODO also whitespace dependent as in addLineForPointChangeDuration
    newLine = "  b.track" + (instrumentIndex + 1) + "vol[" + trackIndex + "] = " + newNoteValue + ";\n"
    existingLineLoc = currentCode.indexOf("  b.track" + (instrumentIndex + 1) + "vol[" + trackIndex + "] =")
    //if code has a line explicitly changed this point, then we update its value
    return replaceCode(existingLineLoc, newLine);

}

function replaceCode(existingLineLoc, newLine) {
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
        codeMirrorInstance.replaceRange(newLine, { line: codeMirrorInstance.lineCount() - 2, ch: 0 });
    }
    return codeMirrorInstance.getValue();
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

function updatePatternFromCode(currentBeat, trackIndex) {
    //every time we advance a time step, pull latest code and update beat object
    let updatedCode = codeMirrorInstance.getValue()
    let dsl = pattern.toString() + setAll.toString() + backBeat.toString() + p.toString()
    let fxnText = '"use strict"; ' + dsl + updatedCode + ' return (genBeat(theBeat, {}, trackIndex));'
    try {
        //TODO if(codeChanged) {
        let f = new Function("theBeat", "trackIndex", fxnText);
        let newData = f(currentBeat, trackIndex);
        let newBeat = newData.beat;
        let newSliders = newData.sliders;
        for (i = 1; i <= 6; i++) {
            newBeat['track' + i.toString() + 'vol'] = newBeat['track' + i.toString()  + 'vol'].map((note) => {
                if (Number.isNaN(note)) { return 0; } else { return note }
            });
            newBeat['track' + i.toString() + 'dur'] = newBeat['track' + i.toString()  + 'dur'].map((note) => {
                if (Number.isNaN(note)) { return 0; } else { return note }
            });
        }
        if (isValidBeat(newBeat) && isValidSliders(newSliders)) { // && theBeat != newBeat){
            console.log(newBeat);
            return { beat: newBeat, sliders: newSliders };
        }
    }
    catch (err) {
        console.log("updatePatternFromCode error, skipping beat state update")
        console.log(err)
    }
    return null;
}

//function that creates new beat with equation as only input
function pattern(equation){
     return new Array(16).fill(0).map(equation);
}

function setAll(val){
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
    return val;
}


function backBeat(){
    return new Array(16).fill(0).map((val,i) => i%2);
}

function isValidBeat(beat) {
    var valid = true;
    for (i = 1; i <= 6; i++) {
        let currentPattern = 'track' + i.toString()
        valid = valid &&
            Array.isArray(beat[currentPattern + 'vol']) &&
            beat[currentPattern + 'vol'].every((v) => v <= 2 && v >= 0) &&
            Array.isArray(beat[currentPattern + 'dur']) &&
            beat[currentPattern + 'dur'].every((v) => v <= 4 && v >= 0);   
    }
    if (!valid) {
        console.log("invalid beat")
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
    return valid;
}


exports.setCMInstance = setCMInstance
exports.synthDurationCode = synthDurationCode
exports.synthNoteCode = synthNoteCode
exports.synthSliderCode = synthSliderCode
exports.updatePatternFromCode = updatePatternFromCode

//
