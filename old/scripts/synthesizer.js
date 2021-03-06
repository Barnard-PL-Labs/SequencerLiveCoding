var regression = require('regression');

//-----
//
// generate js code to generate provided pattern
//
//-----

function genNote(p){
  if (p==null) {
    return null;
  }
  else {
    //WRONG, a note is an obgject as well
    return midiNote = {note: p, channel:1, velocity:100, rawVelocity: 127};
  }
}

//TODO should be using a maybe library
function genPattern() {
  return [null,64,null,65].map(x => genNote(x));
}

exports.synth = function(pattern) {

  rhythm = pattern.map(x => x == null ? 0 : 1);
  
  //collect indicies that have notes
  var rhythmIndicies = []
  var ctr = 0;
  for (i=0; i<rhythm.length; i++) {
    if (rhythm[i] == 1) { 
      rhythmIndicies.push([ctr,i]);
      ctr++;};
  }

		const result = regression.linear(rhythmIndicies);
		const rGradient = result.equation[0]; //every n beats
		const rYIntercept = result.equation[1]; //which beat do we start on 

  pitchPattern = []
  ctr = 0
  pattern.forEach (x => {
    if (x != null) {
      console.log(Array.from(x)[0])
      pitchPattern.push([ctr,Array.from(x)[0].note.number]);
      ctr++;
    } 
  });
		const resultP = regression.linear(pitchPattern);
		const pGradient = resultP.equation[0];
		const pYIntercept = resultP.equation[1];   

  //---
  // generate a rhythm array, 0 reps a beat, null for nothing
  //---
  function every(spacing, offset = 0, length = 16) {
    var x = new Array(length);
    for (i=offset; i < length; i = i+spacing) {
      x[i] = 0;
    }
    return x;
  }
 
  //---
  // apply the function f over the rhythm
  //---
  function applyPitch(f, rhythm) {
    var pattern = new Array(rhythm.length);
    var ctr = 0;
    for (i=0; i<rhythm.length; i++) {
      if (rhythm[i] != null) {
        pattern[i] = f(ctr);
        ctr++;
      }
    }
    return pattern;
  }

   console.log(pattern);
  // console.log(pGradient);
  // console.log(pYIntercept);
  var code = "applyPitch((x => "+pGradient+"*x + "+pYIntercept+"), every("+rGradient+", "+rYIntercept+"))"
  //console.log(code);
  return code;
}
