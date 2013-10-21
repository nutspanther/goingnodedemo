var express = require('express')
    , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(2014);

app.get('*', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
app.use( express.static( __dirname + '/public' ) );

var usernames = {};
var chat = io
    .of('/chat')
    .on('connection', function (socket) {
        socket.on('sendchat', function (data) {
            io.sockets.emit('updatechat', socket.username, data);
        });
        socket.on('adduser', function(username){
            socket.username = username;
            usernames[username] = username;
            socket.emit('updatechat', 'SERVER', 'you have connected');
            socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
            io.sockets.emit('updateusers', usernames);
        });

});