// user router when included in server.js file will preface all below routes with '/users'

var express = require('express'),
    router  = express.Router(),
    Article = require('../models/article'),
    User    = require('../models/user');

// INDEX all users stored in db
router.get('/', function (req, res) {
  if (!req.session.userId) {
    req.session.flash.message = "You must be logged in to view page.";
    res.redirect(302, '/session/new');
  } else {
    User.find({}, function (err, allUsers) {
      if (err) {
        req.session.flash.message = "Error finding index...";
      } else {
        res.render('users/index', {
          users: allUsers
        });
      }
    });
  }
});

// NEW user sign up form
router.get('/new', function (req, res) {
  res.render('users/new');
});

// CREATE new user
router.post('/', function (req, res) {
  var userParams = req.body.user;

  if (!userParams.name) {
    req.session.flash.message = "Name cannot be empty...";
    res.redirect(302, '/users/new');
  } else if (!userParams.email) {
    req.session.flash.message = "Email cannot be empty...";
    res.redirect(302, '/users/new');
  } else if (!userParams.password) {
    req.session.flash.message = "Password cannot be empty...";
    res.redirect(302, '/users/new');
  } else if (passwordIsVerified(userParams)) {
    delete userParams.passwordVerification;

// user method from user model
    User.findOrCreateByEmail(userParams, function (err, user) {
      if (err) {
        console.log(err);
        req.session.flash.message = "Some error has occurred...";
        res.redirect(302, '/users/new');
      } else {
        req.session.flash.message = "Sign up successful!";
        res.redirect(302, '/');
      }
    });
  } else {
    req.session.flash.message = "Password and verification must match.";
    res.redirect(302, '/users/new');
  }
});

function passwordIsVerified (userParams) {
  return !!userParams.password &&
         (userParams.password === userParams.passwordVerification);
};

// SHOW user by id
router.get('/:id', function (req, res) {
  if (req.session.userId === req.params.id) {
    User.findById(req.params.id, function (err, user) {
      if (err) {
        req.session.flash.message = "An error has occurred...";
        res.redirect(302, '/');
      } else if (user) {
        res.render('users/show', {
          user: user
        });
      } else {
        res.redirect(302, '/');
      }
    });
  } else if (req.session.userId) {
    req.session.flash.message = "You cannot view that user's page...";
    res.redirect(302, '/users/' + req.session.userId);
  } else {
    req.session.flash.message = "You must be logged in to see this...";
    res.redirect(302, '/session/new');
  }
});

// EDIT user by id form
router.get('/:id/edit', function (req, res) {
  if (req.session.userId === req.params.id) {
    User.findById(req.params.id, function (err, user) {
      if (err) {
        req.session.flash.message = "An error has occurred...";
        res.redirect(302, '/');
      } else if (user) {
        res.render('users/edit', {
          user: user
        });
      } else {
        res.redirect(302, '/');
      }
    });
  } else if (req.session.userId) {
    req.session.flash.message = "You cannot edit that user's page...";
    res.redirect(302, '/users/' + req.session.userId);
  } else {
    req.session.flash.message = "You must be logged in to see this...";
    res.redirect(302, '/session/new');
  }
});

// UPDATE user by id
router.patch('/:id', function (req, res) {
  var userParams = req.body.user;

  User.findByIdAndUpdate(req.params.id, userParams, function (err, updatedUser) {
    if (err) {
      req.session.flash.message = "Update is Bad...";
    } else {
      req.session.flash.message = "Update completed...";
      res.redirect(302, "/users/" + updatedUser._id);
    }
  });
});

module.exports = router;
