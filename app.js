var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const { fork } = require('child_process');


const { simplifyCode } = require('./serverSide/synthesizer');
const { response } = require('express');
const { mkdir } = require('fs');
const fs = require('fs');

var mostRecentToken;

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});




io.on('connection', (socket) => {
  //spawn a new cvc4 fork for each user
  //TODO, maybe use worker threads instead, currently only one cvc4 query can run at a time
  const synth = fork('serverSide/synthesizer.js');

  console.log('a user connected');
  const uuid = ""+Date.now()
  mkdir("logs/" + uuid, function(e) {
    console.log(e)
  })

  socket.on('disconnect', () => {
      console.log('user disconnected');
      synth.disconnect();
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
      console.log("Took too long and got new user input");
      console.log(mostRecentToken);
      console.log(response["localToken"])
    }
  })

  socket.on('log', (c) => { // telling the app what to do if 'log' message is sent to server (see logger line 8)
    //console.log(c["log"]); // print out whatever was sent over to the server
    fs.writeFile('logs/' + uuid + "/" + "log.txt", "" + c["log"], (err) => {
      if (err) throw err;
    })
  })

});

  
http.listen(3000, () => {
  console.log('listening on *:3000');
  console.log('Open your browser and go to localhost:3000 to start live coding!');
});
