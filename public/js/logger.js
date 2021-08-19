var logData = [];

const logMouseEvent = function (e) { 

    // push("key " + Date.now()) }
    logData.push("mouse, " + e.timeStamp + ", " + e.target);
    console.log(logData);
}

const logKeyEvent = function (e) { 
    // push("key " + Date.now()) }
    logData.push(e);
    console.log(logData);
}

exports.logMouseEvent = logMouseEvent;
exports.logKeyEvent = logKeyEvent;
