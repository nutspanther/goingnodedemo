var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    latest = {};

//Listen to some database connection events
db.on('error', console.error);
db.once('open', function() {
  console.log('Database Connected.');
});

//Connect to the database
mongoose.connect('mongodb://THEteam:password12345@mongo.onmodulus.net:27017/paqe9huJ');

//Some Server configuration
app.use(express.bodyParser());
app.set('view engine', 'ejs');

//Create the movie schema
var movieSchema = new mongoose.Schema({
  title: { type: String },
  mpaa: String,
  release: Number
});

//Movie database object
var Movie = mongoose.model('Movie', movieSchema);

//Initialize the cache with a movie
Movie.findOne({title:'Tremors'}, function(err, movie) {
  if(err) {
    return console.log('Error getting latest %j', err);
  }

  latest = movie;
});

//Get latest movie
app.get('/', function(req, res) {
  res.render('index', latest);
});

//Save a movie, set it to the latest
app.post('/', function(req, res) {
  new Movie(req.body).save(function(err, movie) {
    if(err) {
      return res.send(err.message);
    }

    latest = movie;
    res.send(movie.title + ' saved.');
  });
});

//Start the app
//app.listen(2013);
var io = require('socket.io').listen(2014);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
