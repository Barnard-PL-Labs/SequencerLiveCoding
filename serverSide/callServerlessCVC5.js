const axios = require('axios');

exports.serverlessCallCVC5 = async function(query){

    console.log(query);
    const bodyVal = { "query": query };

    try {
        var result = await axios.post('https://ffjjhx2ybe.execute-api.us-east-1.amazonaws.com/cvc5', bodyVal);
        console.log(result.data)
    }
    catch (e) {
        console.log("failed aws call")
        console.log(e)
        return "unknown"
    }
    return result.data;

}
