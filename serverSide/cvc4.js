const { exec, execSync } = require('child_process');
const fs = require('fs');

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
    "  ((I Int) (ITE Int) (B Bool))\n" +
    "" +
    "(  (I Int (i 0 1 2 3 4 5 6\n" +
    "    (+ I I) (- I I) (* I I) (mod I I) \n" +
    "  ))\n" +
    " (ITE Int (\n" +
    "            (ite (<= i 0) I I)\n" +
    "            (ite (<= i 1) I I)\n" +
    "            (ite (<= i 2) I I)\n" +
    "            (ite (<= i 3) I I)\n" +
    "            (ite (<= i 4) I I)\n" +
    "            (ite (<= i 5) I I)\n" +
    "            (ite (<= i 6) I I)\n" +
    "            (ite (<= i 7) I I)\n" +
    "            (ite (<= i 8) I I)\n" +
    "            (ite (<= i 9) I I)\n" +
    "            (ite (<= i 10) I I)\n" +
    "            (ite (<= i 11) I I)\n" +
    "            (ite (<= i 12) I I)\n" +
    "            (ite (<= i 13) I I)\n" +
    "            (ite (<= i 14) I I)\n" +
    "            (ite (<= i 15) I I)\n" +
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

exports.callPBE = function (examples) { //examples :: [[Int]]
  //console.log(examples);
  cvc4Query = generateSygus(examples);
  fs.writeFile('logs/' + Date.now() + '.sl', cvc4Query, (err) => {
    if (err) throw err;
  })
  //for this to work on mac, might need timeout like https://github.com/santolucito/liveprogramming/blob/ba690f1354abe2580fb5e0ce7484eb1379a3ed6a/lib/javascript/eval_pbe_helpers.js#L46
  timeoutLength = 3;
  var cvc4Command = 'doalarm () { perl -e \'alarm shift; exec @ARGV\' "$@"; }\n doalarm ' + timeoutLength + ' bash -c \"echo \\"' + cvc4Query + '\\" | /usr/local/bin/cvc4 --lang sygus2\"';
  try {
    var sygusOutput = execSync(cvc4Command).toString();
  }
  catch (e) {
    console.error("CVC4 call failed (probably timeout)");
    return "unknown";
  }
  if (sygusOutput.trim() == "unknown") {
    console.log("couldnt find a repair");
    return "unknown";
  }
  return sygusOutput;


}