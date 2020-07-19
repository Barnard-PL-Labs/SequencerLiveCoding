const { callPBE } = require("./cvc4");
const { findMaxSubseq, zipWithIndex } = require("./synthUtils");

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

exports.simplifyCode = function(codeAndBeat) {
    updatedCode = codeAndBeat["code"]
    var arrayOfLines = updatedCode.match(/[^\r\n]+/g);
    //TODO merge multiline commands (e.g. .map w/ fxn over multiple lines) into a single line

    var parsedCode = []
    arrayOfLines.forEach(line => {
        try {
            var parsed = parseCodeLine(line)
            parsedCode.push(parsed);
        } catch (error) {
            
        }
    });
    console.log(parsedCode)

    var subseq = findMaxSubseq(codeAndBeat["beat"]["rhythm5"]);
    arrayToSynth = zipWithIndex(codeAndBeat["beat"]["rhythm5"])
    arrayToSynth.splice(subseq['startMaxSubseq'], subseq['endMaxSubseq'] - subseq['startMaxSubseq']+1);
    callPBE(arrayToSynth);

}