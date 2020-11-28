

//We pull this in on init, which allows us to grab code as the drum machine runs
var codeMirrorInstance = null

function setCMInstance (cm) {
    codeMirrorInstance = cm;
}

function addLineForPointChange(currentCode,newNoteValue, rhythmIndex, instrumentIndex) {
    //generate new line for changed note
    newLine = "  b.rhythm" + (instrumentIndex+1) + "[" + rhythmIndex + "] = " + newNoteValue + ";\n"
    existingLineLoc = currentCode.indexOf("  b.rhythm" + (instrumentIndex+1) + "[" + rhythmIndex + "] =")
    //if code has a line explicitly changed this point, then we update its value
    if (existingLineLoc >=0) {
        var lineChPos = codeMirrorInstance.posFromIndex(existingLineLoc);
        var endReplacePos = JSON.parse(JSON.stringify(lineChPos));
        endReplacePos.ch = newLine.length+1;
        codeMirrorInstance
            .replaceRange(newLine.slice(0, -1), lineChPos, endReplacePos);
    }
    //else code currently has no effect on manually changed pattern, so we can just add a line
    else {
        codeMirrorInstance.replaceRange(newLine, {line: codeMirrorInstance.lineCount()-2, ch: 0})
    }
    return codeMirrorInstance.getValue();
}

function synthCode(newNoteValue, rhythmIndex, instrumentIndex) {
    //get current code
    var currentCode = codeMirrorInstance.getValue()

    var updatedCode = addLineForPointChange(currentCode,newNoteValue, rhythmIndex, instrumentIndex)

    socket.emit('code', {"code":updatedCode, "beat":theBeat});
    // TODO if we get new code any time, put it in the "proposed" box (or just replace existing code)

    socket.on('newCode', function(c) {
        codeMirrorInstance.replaceRange(c, {line: 2, ch:0}, {line: codeMirrorInstance.lineCount()-2, ch: 0});
    });
}

function updatePatternFromCode(){
    //every time we advance a time step, pull latest code and update beat object
    var updatedCode = codeMirrorInstance.getValue()
    try {
        //TODO if(codeChanged) {
        let f = new Function("theBeat", "rhythmIndex", '"use strict"; ' + updatedCode + ' return (genBeat(theBeat, rhythmIndex));');
        let newBeat = f(cloneBeat(theBeat), rhythmIndex);
        for (i = 1; i <= 6; i++) {
            newBeat['rhythm'+i.toString()] = newBeat['rhythm'+i.toString()].map((note) => {if (Number.isNaN(note)) {return 0;} else {return note}});
        }
        if (isValidBeat(newBeat)) { // && theBeat != newBeat){
            theBeat = newBeat;
            redrawAllNotes();
        }
    }
    catch(err) {

    }
}

function isValidBeat(beat) {

    var valid = true;
    for (i = 1; i <= 6; i++) {
        valid = valid &&
            Array.isArray(beat['rhythm'+i.toString()]) &&
            beat['rhythm'+i.toString()].every((v) => v <=2 && v >=0);
    }
    console.log(valid);
    return valid;
}


exports.setCMInstance = setCMInstance
exports.synthCode = synthCode
exports.updatePatternFromCode = updatePatternFromCode

//
