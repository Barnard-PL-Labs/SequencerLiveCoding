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
    
    //When a client asks for new code, we run synthesis and send the result back
    socket.on('code', (c) => {
      socket.emit('newCode', simplifyCode(c));
    });
  });

  
http.listen(3000, () => {
  console.log('listening on *:3000');
});