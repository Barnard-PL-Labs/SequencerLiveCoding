var logData = [];

function uuidv4() {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

var uuid = uuidv4();

const logMouseEvent = function (e) {

  var currentDate = new Date();
  logData.push(uuid + ", clickEvent, " + e.target.id + ", " + e.timeStamp + "," + currentDate + "\n");
  socket.emit('log', { "log": logData }); //sends info to server every time there is a mouseEvent
}



const logKeyEvent = function (e) {

  var currentDate = new Date();
  logData.push(uuid + ", keyEvent, " + e.key + ", " + e.timeStamp + "," + currentDate + "\n");
  socket.emit('log', { "log": logData }); //sends info to server every time there is a mouseEvent
}

exports.logMouseEvent = logMouseEvent;
exports.logKeyEvent = logKeyEvent;

