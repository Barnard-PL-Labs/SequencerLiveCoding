const { exec, execSync } = require('child_process');
const fs = require('fs');

callPBEserverless = function (cvc4Query) { //examples :: String (in sygus format)

  var sygusOutput = ""

  //if (cvc4Query in database) {
  //  sygusOutput = lookupResult(cvc4Query)
  //}
  //else {
  //  do stuff below
  //}

  timeoutLength = 1;
  var cvc4Command = 'bash -c \"echo \\"' + cvc4Query + '\\" | ./cvc5 --lang sygus2\"';
  try {
    console.log("starting new process")
    sygusOutput = execSync(cvc4Command, { timeout: timeoutLength * (1000), detached: true, killSignal: 'SIGKILL' }).toString();
  }
  catch (e) {
    console.error("CVC4 call failed (probably timeout)");
    console.error(e)
    return "unknown";
  }
  if (sygusOutput.trim() == "unknown") {
    console.log("couldnt find a repair");
    return "unknown";
  }
  return sygusOutput;


}

exports.handler = async (event) => {

  const response = {
      statusCode: 200,
      body: JSON.stringify(callPBEserverless(event.query)),
  };
  return response;
};