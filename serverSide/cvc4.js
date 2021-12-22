const { exec, execSync } = require('child_process');
const { response } = require('express');
const fs = require('fs');
const { serverlessCallCVC5 } = require("./callServerlessCVC5.js");

function genOneConstraint(ex) {
  var inputVal = ex[0];
  var outputVal = ex[1];
  return "(constraint (= (patternGen " + inputVal + ") " + outputVal + "))";
}

function genConstraints(examples) {
  return examples.map(genOneConstraint).join("\n");
}

//https://github.com/CVC4/CVC4/issues/4790
function generateSygus(examples) {
  return (
    "(set-logic NIA)\n" +
    "(synth-fun patternGen ((i Int)) Int\n" +
    "  ((I Int) (B Bool))\n" +
    "" +
    "(  (I Int (i 0 1 2 3 4 5 6\n" +
    "    (+ I I) (- I I) (* I I) (mod I I) \n" +
    "  ))\n" +
    "  (B Bool (\n" +
    "    (<= I I) (< I I) (>= I I) (> I I)\n" +
    "  ))\n" +
    ")\n" +
    ")\n" +
    "(declare-var i Int)\n" +
    genConstraints(examples) + "\n" +
    "(check-synth)");

}

exports.callPBE = async function (examples) { //examples :: [[Int]]
  //console.log(examples);
  cvc4Query = generateSygus(examples);

  var sygusOutput = ""

  //if (cvc4Query in database) {
  //  sygusOutput = lookupResult(cvc4Query)
  //}
  //else {
  //  callCVC4 
  //}

  /*fs.writeFile('logs/' + Date.now() + '.sl', cvc4Query, (err) => {
    if (err) throw err;
  })*/
  //for this to work on mac, might need timeout like https://github.com/santolucito/liveprogramming/blob/ba690f1354abe2580fb5e0ce7484eb1379a3ed6a/lib/javascript/eval_pbe_helpers.js#L46
  
  try {
    if (true){ //call serverless
      sygusOutput = await serverlessCallCVC5(cvc4Query)
      sygusOutput = JSON.parse(JSON.parse(sygusOutput["Payload"])["body"])
      console.log(sygusOutput)
    }
    else { //call locally
      timeoutLength = 1;
      var cvc4Command = 'doalarm () { perl -e \'alarm shift; exec @ARGV\' "$@"; }\n doalarm ' + timeoutLength + ' bash -c \"echo \\"' + cvc4Query + '\\" | /usr/local/bin/cvc5 --lang sygus2\"';
      console.log("starting new process")
      sygusOutput = execSync(cvc4Command, { timeout: timeoutLength * (1000), detached: true, killSignal: 'SIGKILL' }).toString();
      console.log(sygusOutput)
    }
  }
  catch (e) {
    console.error("CVC4 call failed (probably timeout)");
    console.error(e)
    return "unknown";
  }
  if (sygusOutput.trim() == "unknown" || sygusOutput.trim() == "\"unknown\"") {
      console.log("couldnt find a repair");
      return "unknown";
    }
    return sygusOutput;  


}
