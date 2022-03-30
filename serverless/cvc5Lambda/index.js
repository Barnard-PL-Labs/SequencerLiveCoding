const { exec, execSync } = require('child_process');
const fs = require('fs');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

callPBEserverless = function (cvc4Query) { //examples :: String (in sygus format)

  var sygusOutput = ""

  timeoutLength = 1;
  var cvc4Command = 'bash -c \"echo \\"' + cvc4Query + '\\" | ./cvc5 --lang sygus2\"';
  try {
    console.log("starting new cvc5 process")
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

const https = require('https')
const URL = require('url')

async function request(url, data) {
    return new Promise((resolve, reject) => {

const options = {
  hostname: url,
  port: 443,
  path: '/cvc5long',
  method: 'POST'
};
        let req = https.request(options)
        req.write(JSON.stringify(data))
        req.end(null, null, () => {
            /* Request has been fully sent */
            resolve(req)
        })
    })
}

exports.handler = async (event) => {
  console.log(event);
  data = event.query;
  if (data == undefined) {
    console.log("trying to read as API call")
    data = JSON.parse(event.body).query;
  }
  synthResponse = '';
  queryInDB= false;
  try {
    synthResponse = await docClient.get(constructQuery(data)).promise();
    synthResponse = synthResponse.Item.response;
    queryInDB = true;
    console.log('found query in db, returning that')
  } catch (err) {
    console.log('didnt find query in db, running synth instead')
    console.log(err);
    synthResponse = JSON.stringify(callPBEserverless(data));
  }
  console.log(synthResponse)
  if (!queryInDB && synthResponse != '"unknown"') {
    try {
      console.log('didnt find query in db, but found a solution - saving result for later')
      await addToTable(data, synthResponse)
    } catch (err) {
      console.log(err);
      return { error: err }
    }
  }
  else if (!queryInDB && synthResponse == '"unknown"') {
      console.log('didnt find query in db or a solution quickly - sending off for slow processing')
      await request('ffjjhx2ybe.execute-api.us-east-1.amazonaws.com', {'query': event.query})
  }

  const response = {
      statusCode: 200,
      body: synthResponse,
  };
  return response;
};

function constructQuery(q) {
  return (
   { TableName : 'CVC5_queries',
       Key: {
          query: q
       }
   });
}

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
  try {
    await docClient.put(constructItem(query, response)).promise();
  } catch (err) {
    console.log(err);
    return err;
  }
}

