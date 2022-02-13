const fs = require('fs');
const path = require('path');

//directory path
const dir = './logs'


var logData = [];

function makeLog(){
  try {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log("logs directory is created.");
    } else {
        console.log("logs directory already exists.");
    }
  } catch (err) {
    console.log(err);
  }
}

function uuidv4() {
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

var uuid = uuidv4();

const logMouseEvent = function (e) {
  logInteraction(e, "clickEvent")
}

const logKeyEvent = function (e) {
  logInteraction(e, "keyEvent")
}

function logInteraction(e, eventType) {
  let value = e.key || e.target.id
  if (!e.repeat) {
    var currentDate = new Date();
    logData.push(uuid + ", " + eventType + ", " + value + ", " + e.timeStamp + "," + currentDate + "\n");
    socket.emit('log', { "log": logData }); //sends info to server every time there is a mouseEvent
  }

}
exports.logMouseEvent = logMouseEvent;
exports.logKeyEvent = logKeyEvent;

