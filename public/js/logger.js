

var logData = [];

var num = 1;


function uuidv4() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

var uuid = uuidv4();

/*
function random() {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16); 
}


function generateUUID() {
    //return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, random());
    return random();
}
*/

// var uuid = generateUUID();





const logMouseEvent = function (e) { 

    var currentDate = new Date().toString();
    // var myVar = x.toString();
    // push("key " + Date.now()) }
    // logData.push("mouse, " + e.timeStamp + ", fffff" + e.target + "\n"); //adding stuff to logData
    
    if (e.target.id == "")
    {
      logData.push(num + ". User " + uuid + " clicked mouse on screen at " + currentDate + "\n"); //adding stuff to logData
    }
    else
    {
      logData.push(num + ". User " + uuid + " clicked mouse on " + e.target.id + " at " + currentDate + "\n"); //adding stuff to logData
    }

    
    // logData.push("e.target: " + e.target + ", e.id: " + e.id + "\n"); //adding stuff to logData
    //console.log(logData);
    socket.emit('log', { "log": logData }); //sends info to server every time there is a mouseEvent
    num++;
  }



const logKeyEvent = function (e) { 

    var currentDate = new Date().toString();
    // var myVar = x.toString();

    if (e.keyCode == 8) {
      logData.push(num + ". User " + uuid + " clicked the backspace key at " + currentDate + "\n"); //adding stuff to logData
      num++;
    }

    if (e.keyCode == 13) {
      logData.push(num + ". User " + uuid + " clicked the enter key at " + currentDate + "\n"); //adding stuff to logData
      num++;
    }

    if (e.keyCode == 46) {
      logData.push(num + ". User " + uuid + " clicked the delete key at " + currentDate + "\n"); //adding stuff to logData
      num++;
    }

    // logData.push("key, " + e.timeStamp + ", fffff" + e.target + "\n"); //adding stuff to logData
    
    // logData.push("User " + uuid + " clicked key on " + e.target.id + " at " + myVar + "\n"); //adding stuff to logData
    
    socket.emit('log', { "log": logData }); //sends info to server every time there is a mouseEvent

}


/*
const logKeyEvent = function (e) { 
    // push("key " + Date.now()) }
    logData.push("key, " + e.timeStamp + ", " + e.target); // original
    // logData.push("key, " + e.timeStamp + ", " + e.);
    // logData.push(e);
    //console.log(logData);

}
*/


exports.logMouseEvent = logMouseEvent;
exports.logKeyEvent = logKeyEvent;

