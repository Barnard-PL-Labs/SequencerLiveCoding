const { exec } = require('child_process');


function genOneConstraint(ex) {
    var inputVal = ex[0];
    var outputVal = ex[1];
    return "(constraint (= (patternGen " + inputVal + ") " + outputVal + "))";
}

function genConstraints(examples) {
    return examples.map(genOneConstraint).join("\n");
}

function generateSygus(examples) {
    return (
        "(set-logic LIA)\n"+    
        "(synth-fun patternGen ((i Int)) Int\n"+
        "  ((I Int) (B Bool))\n"+
        ""+
        "  ( (I Int (i 0 1 2\n"+
        "    (+ I I) (- I I) (* I I) (mod I I) (div I I)\n"+
        "    (ite B I I)"+
        "  ))\n"+
        "    (B Bool (\n"+
        "    (<= I I) (< I I) (>= I I) (> I I)\n"+
        "    ))\n"+
        "  )\n"+
        ")\n"+
        "(declare-var i Int)\n"+
        genConstraints(examples)+"\n"+
        "(check-synth)");

    
}

exports.callPBE = function(examples){ //examples :: [[Int]]
    //console.log(examples);
    cvc4FileContents = generateSygus(examples);
    //console.log(cvc4FileContents)
    exec('echo \"'+cvc4FileContents + '\" | ./cvc4 --lang sygus2' , (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      return;
    }

    console.log(stdout);
    return stdout;
    });
}