var express  = require('express'),
    router   = express.Router(),
    jwt      = require('express-jwt'),
    auth     = jwt({ secret: 'SECRET', userProperty: 'payload' }),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Article  = mongoose.model('Article'),
    Comment  = mongoose.model('Comment'),
    User     = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/////////////////////USER AUTH/////////////////////

// register authentication and return JWT token
router.post('/register', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }

  var newUser = new User();
  newUser.username = req.body.username;
  newUser.setPassword(req.body.password);

  newUser.save(function (err) {
    if (err) { return next(err); }

    return res.json({ token: newUser.generateJWT() });
  });
});

// login authentication and return JWT token
router.post('/login', function (req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: 'Please fill out all fields' });
  }

  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      return res.json({ token: user.generateJWT() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/////////////////////ARTICLES/////////////////////

// index all articles
router.get('/articles', function (req, res, next) {
  Article.find(function (err, allArticles) {
    if (err) { return next(err); }

    res.json(allArticles);
  });
});

// index all articles by author
router.get('/articles/byUser/:name', function (req, res, next) {
  var authorName = req.params.name;

  Article.find({ author: authorName }, function (err, authorArticles) {
    if (err) { return next(err); }

    res.json(authorArticles);
  });
});

// create and save new article
router.post('/articles', auth, function (req, res, next) {
  var newArticle = new Article(req.body);
  newArticle.author = req.payload.username;

  newArticle.save(function (err, article) {
    if (err) { return next(err); }

    res.json(article);
  });
});

// middleware function to preload article object to handle article ID routes (will retrieve and attach article object to the req object for route handlers with :article route parameter)
router.param('article', function (req, res, next, id) {
  var query = Article.findById(id);

  query.exec(function (err, article) {
    if (err) { return next(err); }
    if (!article) { return next(new Error('can\'t find article')); }

    req.article = article;
    return next();
  });
});

// show article by id
router.get('/articles/:article', function (req, res) {
  req.article.populate('comments', function (err, article) {
    if (err) { return next(err); }

    res.json(article);
  });
});

// delete article by id
router.delete('/articles/:article', auth, function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) { return next(err); }

    res.json({
        message: "Article successfully deleted"
      });
  });
});

// edit article by id form
router.get('/articles/:article/edit', function (req, res) {
  if (err) { return next(err); }

  res.json(article);
});

// update article by id
router.patch('/articles/:article', function (req, res) {
  var articleID = req.article.id;

  var articleParams = req.body.article;
  articleParams.author = req.payload.username;

  Article.findByIdAndUpdate(articleID, articleParams, function (err, updatedArticle) {
    if (err) { return next(err); }

    res.json(updatedArticle);
  });
});

/////////////////////COMMENTS/////////////////////

// middleware function to preload comment object to handle comment ID routes (will retrieve and attach comment object to the req object for route handlers with :comment route parameter)
router.param('comment', function (req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment) {
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

// create and save new comment on referenced article by id
router.post('/articles/:article/comments', auth, function (req, res, next) {
  var newComment = new Comment(req.body);
  newComment.article = req.article;
  newComment.author = req.payload.username;

  newComment.save(function (err, comment) {
    if (err) { return next(err); }

    req.article.comments.push(comment);
    req.article.save(function (err, article) {
      if (err) { return next(err); }

      res.json(comment);
    });
  });
});


module.exports = router;
