var express         = require('express'),
    PORT            = process.env.PORT || 3000,
    server          = express(),
    path            = require('path'),
    favicon         = require('serve-favicon'),
    ejs             = require('ejs'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    morgan          = require('morgan'),
    methodOverride  = require('method-override'),
    MONGODBURI      = process.env.MONGODB_URI || "mongodb://localhost:27017",
    dbname          = "wiki",
    mongoose        = require('mongoose'),
    passport        = require('passport');

// connect to db
mongoose.connect(MONGODBURI + "/" + dbname);

// mongoose model registers
require('./models/article');
require('./models/comment');
require('./models/user');

// passport configuration
require('./config/passport');

// all routes
var routes = require('./routes/index');

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

server.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
server.use(morgan('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));
server.use(passport.initialize());

server.use('/', routes);

// server.use(methodOverride("_method"));

// model based route controllers
// server.use('/articles', require('./controllers/articles'));
// server.use('/users', require('./controllers/users'));


// catch 404 and forward to error handler
server.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
server.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.server.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// connect to server
server.listen(PORT, function() {
  console.log("SERVER IS UP ON PORT:", PORT);
});

module.exports = server;
