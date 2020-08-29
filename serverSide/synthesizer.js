const { callPBE } = require("./cvc4");
const { findMaxSubseq, zipWithIndex, checkForSingleEdit } = require("./synthUtils");
const { smt_parser } = require("./parsers/smt_parser");
const { astToJs } = require("./parsers/astToJS");


class ParseError extends Error {
    constructor(message) {
      super("Unhandled syntax: " + message);
      this.name = "ParseError";
    }
}

const IndexOp = (instIndex, rIndex, val) => ({
    'opType' : 'IndexOp',
    'instIndex' : instIndex,
    'rIndex' : rIndex,
    'val' : val
})

const MapOp = (instIndex, fxnParams, fxnBody) => ({
    'opType' : 'MapOp',
    'instIndex' : instIndex,
    'rIndex' : fxnParams,
    'val' : fxnBody
})

process.on('message', (data) => {
    simplifyCode(data["code"]).then((x) => {
        x["localToken"] = data["token"]; 
        process.send(x)
    });
})
    
function parseCodeLine(line) {
    var indexOperation = new RegExp(/b\.rhythm([1-6])\[(1?[0-9])\] ?= ?([0-2])[;,\n]/);
    //TODO, relax assumption that all maps are of the form "b.rhythm1 = b.rhythm1.map"
    var mapOperation = new RegExp(/b\.rhythm([1-6])\.map\((.*)=> *\{(.*)\}\)/);
    
    if (indexOperation.test(line)) {
        matches = line.match(indexOperation);
        return IndexOp(matches[1] - 1, matches[2], matches[3])
    } else if (mapOperation.test(line)) {
        matches = line.match(mapOperation);
        return MapOp(matches[1] - 1, matches[2], matches[3])
    } else {
        throw ParseError(line);
    }
    
}

//check if we have inserted a array index manipulation line of code 
function hasPatternEdit(parsedCode, whichPattern) {
    const matchesP = (codeLine) => codeLine["instIndex"] == whichPattern-1;
    return parsedCode.some(matchesP);
}

simplifyCode = async function(codeAndBeat) {
    var code = codeAndBeat["code"]
    console.log("test")
    var arrayOfLines = code.match(/[^\r\n]+/g);
    //TODO merge multiline commands (e.g. .map w/ fxn over multiple lines) into a single line

    var parsedCode = []
    arrayOfLines.forEach(line => {
        try {
            var parsed = parseCodeLine(line)
            parsedCode.push(parsed);
        } catch (error) {
            
        }
    });

    var newCode = arrayOfLines.slice(1,-2).join("\n")+"\n";

    //remove large subsequences of common vals to make synthesis a bit easier
    //that subseq can then be added with templated code
    //TODO, do this for all patterns & refactor to fxn
    for (whichPattern = 1; whichPattern <= 6; whichPattern++) {
        var singleEditInfo = checkForSingleEdit(codeAndBeat["beat"]["rhythm" + whichPattern])
        if (singleEditInfo["hasOneChangedIndex"]) {
            newCode = newCode.replace(new RegExp(".*rhythm"+whichPattern+".*\n", "g"), '')
            newCode += "  b.rhythm" + whichPattern + " = new Array(16).fill(" + singleEditInfo["fillVal"] + ")\n"
            newCode += "  b.rhythm" + whichPattern + "[" + singleEditInfo["editLoc"] + "] = " + singleEditInfo["editVal"] + ";\n"

        }
        else if (hasPatternEdit(parsedCode, whichPattern)) {
            var synthSolution = sygusOnePattern(codeAndBeat, whichPattern);
            var sygusSolution = synthSolution["code"]
            var subseq = synthSolution["subseq"]
            //turn sygus sol'n to JS code
            //TODO refactor to fxn
            if (sygusSolution != "unknown") {
                var fxnDefs = sygusSolution.split("\n").slice(1);
                var extractDef = new RegExp(/\(.*?\)\) [^ ]* /);
                fxnDefs = fxnDefs.map(f => f.replace(extractDef,"").slice(0,-1));
                var fxnName = sygusSolution.split(" ")[1];
                var newFxn = fxnDefs[0];
                var newNewJsFxnBody = astToJs(smt_parser(newFxn));
                newCode = newCode.replace(new RegExp(".*rhythm"+whichPattern+".*\n", "g"), '')
                newCode += "  b.rhythm" + whichPattern + " = new Array(16).fill(0).map((val,i) => {"+newNewJsFxnBody+" });\n";
                newCode += "  b.rhythm" + whichPattern + ".splice(" + subseq['startMaxSubseq'] + "," + subseq['lengthMaxSubseq'] + ",...Array(" + subseq['lengthMaxSubseq'] + ").fill(" + subseq['valMaxSubseq'] + "));\n"
            }
        }
    }

    //TODO merge newNewJsFxnBody with parsedCode and code
    return {"newCode": newCode};

}

function sygusOnePattern(codeAndBeat, whichPattern) {
    var arrayToSynth = zipWithIndex(codeAndBeat["beat"]["rhythm" + whichPattern]);
    var subseq = findMaxSubseq(codeAndBeat["beat"]["rhythm" + whichPattern]);
    arrayToSynth.splice(subseq['startMaxSubseq'], subseq['lengthMaxSubseq']);

    var sygusSolution = callPBE(arrayToSynth);
    return {"code": sygusSolution, "subseq":subseq};
}
