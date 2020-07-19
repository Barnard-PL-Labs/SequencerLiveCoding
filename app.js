var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const { simplifyCode } = require('./serverSide/synthesizer');

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    socket.on('code', (c) => {
        simplifyCode(c);
      });
  });

  
http.listen(3000, () => {
  console.log('listening on *:3000');
});