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
