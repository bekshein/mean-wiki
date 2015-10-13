// article router when included in server.js file will preface all below routes with '/articles'

var express = require('express'),
    router  = express.Router(),
    Article = require('../models/article');

// renders all articles stored in db
router.get('/', function (req, res) {
  Article.find({}, function (err, allArticles) {
    if (err) {
      res.redirect(302, '/welcome');
    } else {
      res.render('articles/index', {
        articles: allArticles
      });
    }
  });
});

// renders new article form
router.get('/new', function (req, res) {
  res.render('articles/new');
});

// posts new article and redirects
router.post('/', function (req, res) {
  var articleOptions = req.body.article;

  articleOptions.category = articleOptions.category.split(/,\s?/);

  Article.new(articleOptions, function (err, newArticle) {
    if (err) {
      res.redirect(302, '/articles/new');
    } else {
      res.redirect(302, '/articles');
    }
  });
});

// render article by id
router.get('/:id', function (req, res) {
  Article.findById(req.params.id, function (err, specificArticle) {
    if (err) {
      res.redirect(302, '/articles/index');
    } else {
      res.render('articles/show', {
        article: specificArticle
      });
    }
  });
});

// render edit article by id form
router.get('/:id/edit', function (req, res) {
  Article.findById(req.params.id, function (err, specificArticle) {
    if (err) {
      res.redirect(302, '/articles/index');
    } else {
      res.render('articles/edit', {
        article: specificArticle
      });
    }
  });
});

// updates article and redirects
router.patch('/:id', function (req, res) {
  var articleOptions = req.body.article;

  articleOptions.category = articleOptions.category.split(/,\s?/);

  Article.findByIdAndUpdate(req.params.id, articleOptions, function (err, updatedArticle) {
    if (err) {
      res.redirect(302, '/articles/edit');
    } else {
      res.redirect(302, "/articles/" + updatedArticle._id);
    }
  });
});

// deletes article and redirects
router.delete('/:id', function (req, res) {
  Article.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect(302, '/articles/show');
    } else {
      res.redirect(302, '/articles');
    }
  });
});

// router export
module.exports = router;
