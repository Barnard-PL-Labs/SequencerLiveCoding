var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const { fork } = require('child_process');

const { simplifyCode } = require('./serverSide/synthesizer');
const { response } = require('express');
const { mkdir } = require('fs');
const fs = require('fs');
const path = require('path');
const dir = './logs'

require('dotenv').config();

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

function makeLog(){
  try {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log("logs directory is created");
    } else {
        console.log("logs directory exists");
    }
  } catch (err) {
    console.log(err);
  }
}
var logger = makeLog();

//spawn a new thread for synthesis
//one thread runs the server, one thread handles all synthesis requests
const synth = fork('serverSide/synthesizer.js');
io.on('connection', (socket) => {
  let mostRecentToken;
  let logData;

  console.log('a user connected');
  const uuid = ""+Date.now()
  mkdir("logs/" + uuid, function(e) {
    console.log(e)
  })

  socket.on('disconnect', () => {
      console.log('user disconnected, trying to save logs');
      fs.writeFile('logs/' + uuid + "/" + "log.txt", "" + logData, (err) => {
        if (err) throw err;
      })
    });
  
  //When a client asks for new code, we run synthesis and send the result back
  socket.on('code', (c) => {
    mostRecentToken = Math.random();
    console.log(mostRecentToken);
    const localToken = mostRecentToken
    synth.send({"code": c, "token": localToken});
   
  });

  synth.on('message', (response) => {
    if (response["localToken"] == mostRecentToken) {
      socket.emit('newCode', response["newCode"]);
    }
    else {
      console.log("Token mismatch - either took too long and got new user input, or this result was for someone else");
      console.log(mostRecentToken);
      console.log(response["localToken"])
    }
  })

  socket.on('log', (c) => { // telling the app what to do if 'log' message is sent to server (see logger line 8)
    logData = (c["log"]); // print out whatever was sent over to the server
  })

});

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production") {
  http.listen(80, () => {
    console.log('Starting server in prod mode');
    console.log('listening on *:80');
    console.log('Open your browser and go to localhost:80 to start live coding!');
  });
} else {
  http.listen(3000, () => {
    console.log('Starting server in dev mode');
    console.log('listening on *:3000');
    console.log('Open your browser and go to localhost:3000 to start live coding!');
  });
}
