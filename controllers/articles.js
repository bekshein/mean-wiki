// article router when included in server.js file will preface all below routes with '/articles'

var express = require('express'),
    router  = express.Router(),
    Article = require('../models/article');

// INDEX all articles stored in db
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

// NEW article form
router.get('/new', function (req, res) {
  res.render('articles/new');
});

// CREATE new article and redirects
router.post('/', function (req, res) {
  var newArticle = new Article(req.body.article);

  newArticle.save(function (err, article) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(302, '/articles');
    }
  });
});
/*  Article.new(req.body.article, function (err, newArticle) {
    if (err) {
      res.redirect(302, '/articles/new');
    } else {
      res.redirect(302, '/articles');
    }
  });
}); */

// SHOW article by id
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

// DELETE article and redirects
router.delete('/:id', function (req, res) {
  Article.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect(302, '/articles/show');
    } else {
      res.redirect(302, '/articles');
    }
  });
});

// EDIT article by id form
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

// UPDATE article and redirects
router.patch('/:id', function (req, res) {
  Article.findByIdAndUpdate(req.params.id, req.body.article, function (err, updatedArticle) {
    if (err) {
      res.redirect(302, '/articles/edit');
    } else {
      res.redirect(302, "/articles/" + updatedArticle._id);
    }
  });
});


// router export
module.exports = router;
