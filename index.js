var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
	  io = require('socket.io').listen(server),
  	mongoose = require('mongoose'),
    db = mongoose.connection,
    schema = mongoose.Schema;
server.listen(2014);

//Listen to some database connection events
db.on('error', console.error);
db.once('open', function() {
  console.log('Database Connected.');
});

//Connect to the database
mongoose.connect('mongodb://THEteam:password12345@mongo.onmodulus.net:27017/paqe9huJ');

// BEGIN location schema
// TODO: Move out
var locationSchema = new mongoose.Schema({
  name: String ,
  north : schema.Types.ObjectId,
  south : schema.Types.ObjectId,
  east  : schema.Types.ObjectId,
  west  : schema.Types.ObjectId,
  up    : schema.Types.ObjectId,
  down  : schema.Types.ObjectId,
});

var Location = mongoose.model( "Location", locationSchema );

var Lobby = new Location( { name: "lobby" } );
var EastRoom = new Location( { name: "east room" } );
var WestRoom = new Location( { name: "west room" } );
var NorthRoom = new Location( { name: "north room" } );
var MainRoom = new Location( { name: "main room",
                               north: NorthRoom,
                               east:  EastRoom,
                               west:  WestRoom,
                               south: Lobby
} );

Lobby.north = MainRoom;
EastRoom.west = MainRoom;
WestRoom.east = MainRoom;
NorthRoom.south = MainRoom;
MainRoom.save();
Lobby.save();
EastRoom.save();
NorthRoom.save();
WestRoom.save();
// END location schema

app.set('view engine', 'ejs');

var classSchema = new mongoose.Schema({
  name: String,
  hp: Number,
  str: Number,
  def: Number,
  spd: Number,
  mgc: Number
});
var Class = mongoose.model('Classes', classSchema);

var classes = [];

Class.find(function(err, cls) {
    if (err) return console.error(err);
     classes = cls;
  });


app.get('/get-character', function(req, res) {
	console.log(classes);
  res.render('client', {classList: classes});
});

app.use( express.static( __dirname + '/public' ) );

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
