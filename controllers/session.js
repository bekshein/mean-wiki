// session router when included in server.js file will preface all below routes with '/session'

var express = require('express'),
    router  = express.Router(),
    User    = require('../models/user');

// User sign in form
router.get('/new', function (req, res) {
  res.render('session/new');
});

// User logged in
router.post('/', function (req, res) {
  var userParams = req.body.user;

  User.findOne(userParams, function (err, user) {
    if (err) {
      req.session.flash.message = "Some error has occurred...";
      res.redirect(302, '/session/new');
    } else if (user) {
      req.session.userId = user._id;
      req.session.userName = user.name;
      req.session.flash.message = "Thanks for signing in...";
      res.redirect(302, '/articles');
    } else {
      req.session.flash.message = "Email and password combination does not exist / match...";
      res.redirect(302, '/session/new');
    }
  });
});

// User logged out
router.delete('/', function (req, res) {
  delete req.session.userId;
  delete req.session.userName;
  req.session.flash.message = "Thanks for signing out.";
  res.redirect(302, '/');
});

module.exports = router;
