var app = angular.module('meanWiki', ['ui.router', 'ui.bootstrap']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        articlePromise: ['articles', function (articles) {
          return articles.getAll();
        }]
      }
    })
    .state('author', {
      url: '/articles/byUser/{author}',
      templateUrl: '/author.html',
      controller: 'AuthorCtrl',
      resolve: {
        articlePromise: ['articles', function (articles) {
          return articles.getAll();
        }],
        author: ['$stateParams', 'articles', function ($stateParams, articles) {
          return articles.getAuthor($stateParams.author);
        }]
      }
    })
    .state('new', {
      url: '/articles/new',
      templateUrl: '/new.html',
      controller: 'MainCtrl',
      onEnter: ['$state', 'auth', function ($state, auth) {
        if (!auth.isLoggedIn()) {
          $state.go('home');
        }
      }]
    })
    .state('articles', {
      url: '/articles/{id}',
      templateUrl: '/articles.html',
      controller: 'ArticlesCtrl',
      resolve: {
        article: ['$stateParams', 'articles', function ($stateParams, articles) {
          return articles.get($stateParams.id);
        }]
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function ($state, auth) {
        if (auth.isLoggedIn()) {
          $state.go('home');
        }
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: '/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function ($state, auth) {
        if (auth.isLoggedIn()) {
          $state.go('home');
        }
      }]
    });

    $urlRouterProvider.otherwise('home');
}]);

app.factory('auth', ['$http', '$window', function ($http, $window) {
  var auth = {};

  auth.saveToken = function (token) {
    $window.localStorage['mean-wiki-token'] = token;
  };

  auth.getToken = function () {
    return $window.localStorage['mean-wiki-token'];
  };

  auth.isLoggedIn = function () {
    var token = auth.getToken();

    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function () {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function (user) {
    return $http.post('/register', user).success(function (data) {
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function (user) {
    return $http.post('/login', user).success(function (data) {
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function () {
    $window.localStorage.removeItem('mean-wiki-token');
  };

  return auth;
}]);

app.factory('articles', ['$http', 'auth', function ($http, auth) {
  var o = {
    articles: []
  };
  o.getAll = function () {
    return $http.get('/articles').success(function (data) {
      angular.copy(data, o.articles);
    });
  };
  o.getAuthor = function (author) {
    return $http.get('/articles/byUser/' + author).then(function (res) {
      return author;
    });
  };
  o.get = function (id) {
    return $http.get('/articles/' + id).then(function (res) {
      return res.data;
    });
  };
  o.create = function (article) {
    return $http.post('/articles', article, {
      headers: { Authorization: 'Bearer '+auth.getToken() }
    }).success(function (data) {
      o.articles.push(data);
    });
  };
  o.delete = function (article) {
    return $http.delete('/articles/' + article._id, {
      headers: { Authorization: 'Bearer '+auth.getToken() }
    }).success(function (res) {
      delete article;
    });
  };
  o.addComment = function (id, comment) {
    return $http.post('/articles/' + id + '/comments', comment, {
      headers: { Authorization: 'Bearer '+auth.getToken() }
    });
  };
  return o;
}]);

app.controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function (error) {
      $scope.error = error;
    }).then(function () {
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function (error) {
      $scope.error = error;
    }).then(function () {
      $state.go('home');
    });
  };
}]);

app.controller('NavCtrl', ['$scope', 'auth', function ($scope, auth) {
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;

  $scope.isNavCollapsed = true;
}]);

app.controller('MainCtrl', ['$scope', '$state', 'articles', 'auth', function ($scope, $state, articles, auth) {
  $scope.articles = articles.articles;

  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.addArticle = function () {
    if (!$scope.title || $scope.title === '') { return; }
    articles.create({
      title: $scope.title,
      summary: $scope.summary,
      content: $scope.content
    }).error(function (error) {
      $scope.error = error;
    }).then(function () {
      $state.go('home');
    });
  };
}]);

app.controller('AuthorCtrl', ['$scope', '$state', 'articles', 'author', 'auth', function ($scope, $state, articles, author, auth) {
  $scope.articles = articles.articles;

  $scope.author = author;

  $scope.isLoggedIn = auth.isLoggedIn;
}]);

app.controller('ArticlesCtrl', ['$scope', '$state', 'articles', 'article', 'auth', function ($scope, $state, articles, article, auth) {
  $scope.article = article;

  $scope.isLoggedIn = auth.isLoggedIn;

  $scope.deleteArticle = function (article) {
    articles.delete(article).then(function () {
      $state.go('home');
    });
  };

  $scope.addComment = function () {
    if (!$scope.body || $scope.body === '') { return; }
    articles.addComment(article._id, {
      body: $scope.body,
    }).success(function (comment) {
      $scope.article.comments.push(comment);
    });
    $scope.body = '';
  };
}]);
