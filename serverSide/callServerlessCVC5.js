const AWS = require("aws-sdk");
const lambda = new AWS.Lambda({ region: 'us-east-1'});

exports.serverlessCallCVC5 = async function(query){

    console.log(query)
    const params = {
        FunctionName: "cvc5",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ "query": query })
      };
    
    try {
        var result = await lambda.invoke(params).promise();
        console.log(result)
    }
    catch (e) {
        console.log("failed aws call")
        console.log(e)
        return "unknown"
    }
    return result;

}
