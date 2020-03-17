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
    return midiNote = {note: p, channel:1, velocity:100, rawVelocity: 127};
  }
}

//TODO should be using a maybe library
function genPattern() {
  return [null,64,null,65].map(x => genNote(x));
}

function synth(pattern) {
  pattern = genPattern()
  console.log(pattern);
  code = "";

  rhythm = pattern.map(x => x == null ? 0 : 1);
  console.log(rhythm);
  
  //collect indicies that have notes
  rhythmIndicies = []
  ctr = 0;
  for (i=0; i<rhythm.length; i++) {
    if (rhythm[i] == 1) { 
      rhythmIndicies.push([ctr,i]);
      ctr++;};
  }

		const result = regression.linear(rhythmIndicies);
		const gradient = result.equation[0];
		const yIntercept = result.equation[1];   

  console.log(gradient);
  console.log(yIntercept);
  //check if note happens every n beats

  pitchPattern = []
  pattern.forEach (x => {
    if (x != null) {
      console.log(x)
      pitchPattern.push(x.note);
    } 
  });
  console.log(pitchPattern);
  return code;
}

synth([]);
