var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mongoose = require('mongoose'),
    db = mongoose.connection;

//Listen to some database connection events
db.on('error', console.error);
db.once('open', function() {
  console.log('Database Connected.');
});
mongoose.connect('mongodb://THEteam:password12345@mongo.onmodulus.net:27017/paqe9huJ');

app.use(express.bodyParser());
app.set('view engine', 'ejs');

var roomSchema = new mongoose.Schema({
  name: String
});
var Room = mongoose.model('Room', roomSchema);

server.listen(2014);

app.get('/admin', function (req, res) {
  res.sendfile(__dirname + '/public/admin.html');
});

app.get('/rooms', function (req, res) {
  Room.find(function(err, rooms) {
    console.log(rooms);
    res.render('rooms', {"rooms": rooms});
  });
});

app.use( express.static( __dirname + '/public' ) );

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('create_room', function (data) {
    console.log("Creating room: ", data);
    new Room(data).save(function(err, room) {
      if(err) {
        return; // Do something
      }

      console.log(room.name + ' saved.');
    });
  });
});
