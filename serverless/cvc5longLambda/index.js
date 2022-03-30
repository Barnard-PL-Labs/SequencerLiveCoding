//a long running cvc5 lambda that puts it result into the db
//no need to search the db - we only run this if we failed to find a result previously

const { exec, execSync } = require('child_process');
const fs = require('fs');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

callPBEserverless = function (cvc4Query) { //examples :: String (in sygus format)

  var sygusOutput = ""

  timeoutLength = 60;
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
  console.log(event);
  data = event.query;
  if (data == undefined) {
    console.log("trying to read as API call")
    data = JSON.parse(event.body).query;
  }
  synthResponse = JSON.stringify(callPBEserverless(data));
  const response = {
      statusCode: 200,
      body: synthResponse,
  };
  try {
    console.log('saving result (even a negative result) for later');
    await addToTable(data, response.body)
  } catch (err) {
    console.log(err);
    return { error: err }
  }

  return response;
};

function constructItem(q,r) {
  return (
   { TableName : 'CVC5_queries',
       Item: {
          query: q,
          response: r
       }
   });
}

async function addToTable(query, response){
  console.log("here");
  try {
    await docClient.put(constructItem(query, response)).promise();
  } catch (err) {
    console.log(err);
    return err;
  }
}

