const { callPBE } = require("./cvc4");
const { findMaxSubseq, zipWithIndex, checkForSingleEdit } = require("./synthUtils");
const { smt_parser } = require("./parsers/smt_parser");
const { astToJs } = require("./parsers/astToJS");
const instrument = {
    1: "track6",
    2: "track5",
    3: "track4",
    4: "Tom 1",
    5: "track2",
    6: "track3"
};

class ParseError extends Error {
    constructor(message) {
        super("Unhandled syntax: " + message);
        this.name = "ParseError";
    }
}

const IndexOp = (instIndex, rIndex, val) => ({
    'opType': 'IndexOp',
    'instIndex': instIndex,
    'rIndex': rIndex,
    'val': val
})

const MapOp = (instIndex, fxnParams, fxnBody) => ({
    'opType': 'MapOp',
    'instIndex': instIndex,
    'rIndex': fxnParams,
    'val': fxnBody
})

process.on('message', (data) => {
    simplifyCode(data["code"]).then((x) => {
        x["localToken"] = data["token"];
        process.send(x)
    });
})

function parseCodeLine(line, durOrVol) {
    if (durOrVol == "vol") {
        var indexOperation = new RegExp(/b\.track([1-6])vol\[(1?[0-9])\] ?= ?([0-2])[;,\n]/);
        //TODO, relax assumption that all maps are of the form "b.track1vol = b.track1vol.map"
        var mapOperation = new RegExp(/(b\.track([1-6])vol(\s?))=(\s?)pattern\((.*)=>(.*)\);/g);
        //g-tag: matches only contain results that match the COMPLETE regExp
    }

    else {
        var indexOperation = new RegExp(/b\.track([1-6])dur\[(1?[0-9])\] ?= ?([1-4])[;,\n]/);
        //TODO, relax assumption that all maps are of the form "b.track1vol = b.track1vol.map"
        var mapOperation = new RegExp(/(b\.track([1-6])dur(\s?))=(\s?)pattern\((.*)=>(.*)\);/g);
        //g-tag: matches only contain results that match the COMPLETE regExp
    }
    //if line has match with indexOp
    if (indexOperation.test(line)) {
        matches = line.match(indexOperation);
        return IndexOp(matches[1] - 1, matches[2], matches[3])
        //if line has match with mapOp
    } else if (mapOperation.test(line)) {
        //matches: a string array of matching retult(s)
        matches = line.match(mapOperation);
        return MapOp(matches[1] - 1, matches[2], matches[3])
    } else {
        throw new ParseError(line);
    }

}

//check if we have inserted a array index manipulation line of code 
function hasPatternEdit(parsedCode, parsedOldCode, whichPattern) {
    const matchesP = (codeLine) => { return codeLine["instIndex"] == whichPattern - 1 && codeLine["opType"] == IndexOp().opType };
    arrayEditsNew = parsedCode.filter(matchesP).length;
    arrayEditsOld = parsedOldCode.filter(matchesP).length;
    return (arrayEditsNew > 0 && arrayEditsNew != arrayEditsOld)
}

function parseIntoLines(c, durOrVol) {
    var parsedCode = []
    c.match(/[^\r\n]+/g).forEach(line => {
        try {
            var parsed = parseCodeLine(line, durOrVol)
            parsedCode.push(parsed);
        } catch (error) {
            //these errors are non-synthesized lines, don't do anything
        }
    });
    return parsedCode;
}

simplifyCode = async function (codeAndBeat) {
    var code = codeAndBeat["code"]
    var oldCode = codeAndBeat["oldCode"]
    var durOrVol = codeAndBeat["durOrVol"]

    //TODO merge multiline commands (e.g. .map w/ fxn over multiple lines) into a single line
    var parsedCode = parseIntoLines(code, durOrVol);
    var parsedOldCode = parseIntoLines(oldCode, durOrVol);
    var arrayOfLines = code.match(/[^\r\n]+/g);

    var newCode = arrayOfLines.join("\n") + "\n";

    //remove large subsequences of common vals to make synthesis a bit easier
    //that subseq can then be added with templated code
    //TODO, do this for all patterns & refactor to fxn
    for (whichPattern = 1; whichPattern <= 6; whichPattern++) {
        var singleEditInfo = checkForSingleEdit(codeAndBeat["beat"]["track" + whichPattern + durOrVol])
        if (singleEditInfo["hasOneChangedIndex"]) {
            console.log("Pattern " + whichPattern + " has singleEdit");
            newCode = newCode.replace(new RegExp(".*track" + whichPattern + durOrVol + ".*\n", "g"), '')
            newCode += "b.track" + whichPattern + durOrVol + " = new Array(16).fill(" + singleEditInfo["fillVal"] + ")\n"
            newCode += "b.track" + whichPattern + durOrVol + "[" + singleEditInfo["editLoc"] + "] = " + singleEditInfo["editVal"] + ";\n"

        }
        else if (hasPatternEdit(parsedCode, parsedOldCode, whichPattern)) {
            console.log("Pattern " + whichPattern + " has patternEdit");
            var synthSolution = await sygusOnePattern(codeAndBeat, whichPattern, durOrVol);
            var sygusSolution = synthSolution["code"]
            var subseq = synthSolution["subseq"]
            //turn sygus sol'n to JS code
            //TODO refactor to fxn
            if (sygusSolution != "unknown") {
                var fxnDefs = sygusSolution.split("\n").slice(1);
                var extractDef = new RegExp(/\(.*?\)\) [^ ]* /);
                fxnDefs = fxnDefs.map(f => f.replace(extractDef, "").slice(0, -1));
                console.log(sygusSolution.split(" "))
                var fxnName = sygusSolution.split(" ")[1];
                var newFxn = fxnDefs[0];
                var newNewJsFxnBody = astToJs(smt_parser(newFxn));
                newCode = newCode.replace(new RegExp(".*track" + whichPattern + durOrVol + ".*\n", "g"), '')
                //corresponds to the new .pattern() in synthesis.js
                newCode += displayPattern(whichPattern, newNewJsFxnBody, durOrVol);
                newCode += "b.track" + whichPattern + durOrVol + ".splice(" + subseq['startMaxSubseq'] + "," + subseq['lengthMaxSubseq'] + ",...Array(" + subseq['lengthMaxSubseq'] + ").fill(" + subseq['valMaxSubseq'] + "));\n"
            }
        }
    }

    //TODO merge newNewJsFxnBody with parsedCode and code
    return { "newCode": newCode };

}

//function that displays the .pattern() keyword in place of "new Array(16).fill(0)..."
function displayPattern(whichPattern, newNewJsFxnBody, durOrVol) {
    console.log("newFxn: " + newNewJsFxnBody);
    var equation = newNewJsFxnBody.replace('return', '').replace(';', '').trim();
    console.log("new .pattern() added");
    //    return "  " + instrument[whichPattern] + " = pattern((val,i) => " + equation+");\n";
    return "b.track" + whichPattern + durOrVol + " = pattern((val,i) => " + equation + ");\n";
}

async function sygusOnePattern(codeAndBeat, whichPattern, durOrVol) {
    var arrayToSynth = zipWithIndex(codeAndBeat["beat"]["track" + whichPattern + durOrVol]);
    var subseq = findMaxSubseq(codeAndBeat["beat"]["track" + whichPattern + durOrVol]);
    arrayToSynth.splice(subseq['startMaxSubseq'], subseq['lengthMaxSubseq']);

    var sygusSolution = await callPBE(arrayToSynth);
    return { "code": sygusSolution, "subseq": subseq };
}
