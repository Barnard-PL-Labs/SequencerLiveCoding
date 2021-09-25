var logData = [];

const logMouseEvent = function (e) { 

    // push("key " + Date.now()) }
    logData.push("mouse, " + e.timeStamp + ", " + e.target); //adding stuff to logData
    //console.log(logData);
    socket.emit('log', { "log": logData }); //sends info to server every time there is a mouseEvent
}

const logKeyEvent = function (e) { 
    // push("key " + Date.now()) }
    logData.push(e);
    //console.log(logData);
}

exports.logMouseEvent = logMouseEvent;
exports.logKeyEvent = logKeyEvent;
