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

var classSchema = new mongoose.Schema({
  name: String,
  hp: Number,
  str: Number,
  def: Number,
  spd: Number,
  mgc: Number
});

var userSchema = new mongoose.Schema( {
  name: String,
  class: schema.Types.ObjectId,
  location: schema.Types.ObjectId,
  loggedIn: Boolean
});

var User = mongoose.model( "User", userSchema );

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

DummyUser = new User ( { name: "bob", location: Lobby } );
DummyUser.save();

// END location schema

app.set('view engine', 'ejs');

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

var usernames = {};
    io.on('connection', function (socket) {
        socket.on('sendchat', function (data) {
            var movement = data;
            Location.findOne( { _id: DummyUser.location }, function (err, currLocation) {
              console.log( "User is at " + currLocation.name );
              console.log ( "Attempting to move to " + movement );
              switch ( movement ) {
                case "north":
                case "south":
                case "east":
                case "west":
                case "up":
                case "down":
                  DummyUser.location = currLocation[ movement];
                  Location.findOne( { _id: DummyUser.location },
                                   function (err, currLocation) {
                                     io.sockets.emit('updatechat', socket.username, currLocation.name);
                                   });
                  break;
                default:
                    console.log( "Go where now?" );
              }
            });
            console.log(data);
        });
        socket.on('adduser', function(username){
            socket.username = username;
            usernames[username] = username;
            socket.emit('updatechat', 'SERVER', 'you have connected');
            socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
            io.sockets.emit('updateusers', usernames);
        });

});
