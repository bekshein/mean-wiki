var express           = require('express'),
    PORT              = process.env.PORT || 3000,
    server            = express(),
    ejs               = require('ejs'),
    expressEjsLayouts = require('express-ejs-layouts'),
    bodyParser        = require('body-parser'),
    morgan            = require('morgan'),
    methodOverride    = require('method-override'),
    MONGOURI          = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
    dbname            = "wiki",
    mongoose          = require('mongoose'),
    Schema            = mongoose.Schema,
    session           = require('express-session');


server.set('views', './views');
server.set('view engine', 'ejs');

server.use(session({
  secret: "Wiki on the Rocks",
  resave: false,
  saveUninitialized: true
}));

server.use(function (req, res, next) {
    res.locals.flash  = req.session.flash || {};
    req.session.flash = {};
    next();
});

server.use(morgan('dev'));
server.use(express.static('./public'));
server.use(expressEjsLayouts);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(methodOverride("_method"));


server.use(function (req, res, next) {
  console.log("REQ DOT BODY", req.body);
  console.log("REQ DOT SESSION", req.session);
  next();
});

// model based controllers
server.use('/articles', require('./controllers/articles'));
server.use('/session', require('./controllers/session'));
server.use('/users', require('./controllers/users'));

server.get('/', function (req, res) {
  res.render('welcome');
});



mongoose.connect(MONGOURI + "/" + dbname);
server.listen(PORT, function() {
  console.log("SERVER IS UP ON PORT:", PORT);
});
