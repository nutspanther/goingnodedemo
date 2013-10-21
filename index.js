var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
	io = require('socket.io').listen(server),
  	mongoose = require('mongoose'),
    db = mongoose.connection;

server.listen(2014);

//Listen to some database connection events
db.on('error', console.error);
db.once('open', function() {
  console.log('Database Connected.');
});

//Connect to the database
mongoose.connect('mongodb://THEteam:password12345@mongo.onmodulus.net:27017/paqe9huJ');

//BELOW IS THE CODE I USED TO GENERATE the 4 CLASSES

// var classSchema = new mongoose.Schema({
//   name: String,
//   hp: Number,
//   str: Number,
//   def: Number,
//   spd: Number,
//   mgc: Number
// });

// //Movie database object
// var Class = mongoose.model('Classes', classSchema);

// var knight = new Class({
//   name: 'Knight',
//   hp: 100,
//   str: 100,
//   def: 100,
//   spd: 20,
//   mgc: 10
// });

// var mage = new Class({
//   name: 'Mage',
//   hp: 120,
//   str: 10,
//   def: 60,
//   spd: 50,
//   mgc: 100
// });

// var rogue = new Class({
//   name: 'Rogue',
//   hp: 70,
//   str: 60,
//   def: 40,
//   spd: 120,
//   mgc: 30
// });

// var witch = new Class({
//   name: 'Witch',
//   hp: 110,
//   str: 30,
//   def: 80,
//   spd: 70,
//   mgc: 80
// });

// knight.save(function(err, knight) {
//   if (err) return console.error(err);
//   console.log(knight);
// });

// mage.save(function(err, mage) {
//   if (err) return console.error(err);
//   console.log(mage);
// });

// rogue.save(function(err, rogue) {
//   if (err) return console.error(err);
//   console.log(rogue);
// });

// witch.save(function(err, witch) {
//   if (err) return console.error(err);
//   console.log(witch);
// });


app.use( express.static( __dirname + '/public' ) );

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
