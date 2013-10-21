var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(2014);

app.get('/admin', function (req, res) {
  res.sendfile(__dirname + '/public/admin.html');
});

app.use( express.static( __dirname + '/public' ) );

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
