// article router when included in server.js file will preface all below routes with '/articles'

var express = require('express'),
    router  = express.Router(),
    Article = require('../models/article');
    User    = require('../models/user');

// INDEX all articles stored in db
router.get('/', function (req, res) {
  if (!req.session.userId) {
    req.session.flash.message = "You must be logged in to view page.";
    res.redirect(302, '/users/login');
  } else {
    Article.find({}, function (err, allArticles) {
      if (err) {
        req.session.flash.message = "Error finding index...";
      } else {
        res.render('articles/index', {
          articles: allArticles
        });
      }
    });
  }
});

// NEW article form
router.get('/new', function (req, res) {
  if (!req.session.userId) {
    req.session.flash.message = "You must be logged in to view page.";
    res.redirect(302, '/users/login');
  } else {
    User.findById(req.session.userId, function (err, user) {
      if (err) {
        req.session.flash.message = "An error has occurred...";
        res.redirect(302, '/');
      } else if (user) {
        res.render('articles/new', {
          user: user
        });
      }
    });
  }
});

// CREATE new article and redirects
router.post('/', function (req, res) {
  var articleOptions = req.body.article;
  articleOptions.author = req.session.userName;

  var newArticle = new Article(articleOptions);

  newArticle.save(function (err, article) {
    if (err) {
      req.session.flash.message = "Could not save article to db...";
      res.redirect(302, '/articles/new');
    } else {
      req.session.flash.message = "Article saved to db...";
      res.redirect(302, '/articles');
    }
  });
});

// SHOW article by id
router.get('/:id', function (req, res) {
  if (!req.session.userId) {
    req.session.flash.message = "You must be logged in to view page.";
    res.redirect(302, '/users/login');
  } else {
    var articleID = req.params.id;

    Article.findById(articleID, function (err, specificArticle) {
      if (err) {
        req.session.flash.message = "Error finding Article...";
        res.redirect(302, '/articles');
      } else {
        res.render('articles/show', {
          article: specificArticle
        });
      }
    });
  }
});

// DELETE article and redirects
router.delete('/:id', function (req, res) {
  if (!req.session.userId) {
    req.session.flash.message = "You must be logged in to view page...";
    res.redirect(302, '/users/login');
  } else {
    var articleID = req.params.id;

    Article.findByIdAndRemove(articleID, function (err) {
      if (err) {
        req.session.flash.message = "Error with deleting...";
      } else {
        req.session.flash.message = "Succesfully deleted...";
        res.redirect(302, '/articles');
      }
    });
  }
});

// EDIT article by id form
router.get('/:id/edit', function (req, res) {
  if (!req.session.userId) {
    req.session.flash.message = "You must be logged in to view page.";
    res.redirect(302, '/users/login');
  } else {
    var articleID = req.params.id;

    Article.findById(articleID, function (err, specificArticle) {
      if (err) {
        req.session.flash.message = "Error finding Article...";
        res.redirect(302, '/articles');
      } else {
        res.render('articles/edit', {
          article: specificArticle
        });
      }
    });
  }
});

// UPDATE article and redirects
router.patch('/:id', function (req, res) {
  var articleID = req.params.id;
  var articleParams = req.body.article;

  articleParams.author = req.session.userName;

  Article.findByIdAndUpdate(articleID, articleParams, function (err, updatedArticle) {
    if (err) {
      req.session.flash.message = "Update is Bad...";
    } else {
      req.session.flash.message = "Update completed...";
      res.redirect(302, "/articles/" + updatedArticle._id);
    }
  });
});


// router export
module.exports = router;
