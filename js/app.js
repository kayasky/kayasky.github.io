var myApp = angular.module("myApp", []);

myApp.controller("myAppCtrl", [ "$scope", "$http", "$q", function($scope, $http, $q) {
  $scope.instaPosts = [], // This will contain all the instagram posts
  $scope.instaPost = {},
  $scope.coverImage = "",
  $scope.coverVideo = "",
  $scope.instaReloadInterval = 8000,
  $scope.instaParams = {
    "uid": "2966059",
    "client_id": "1716a38e53104ce5b87665e86faad108"
  }; //instagram constants

  $scope.buildInstagramURI = function(params) {
    return "https://api.instagram.com/v1/users/" + params.uid + "/media/recent/?client_id=" + params.client_id + "&callback=JSON_CALLBACK";
  };

  $scope.getRandomIntInclusive = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  $scope.handleException = function() {
    console.log(arguments);
  }

  /** This returns a promise with the instagram posts */
  $scope.getInstagramPosts = function(params) {
    return $q(function(resolve, reject) {
      $http.jsonp($scope.buildInstagramURI(params))
        .success(function(result, status, headers, config) {
          resolve(result.data);
        }).
        error(function(result, status, headers, config) {
          reject(result, status, headers, config);
        });
    });
  };

  $scope.parsePost = function(post) {
    $scope.coverImage = post.images.standard_resolution.url;
    if (post.videos) {
      $scope.coverVideo = post.videos.standard_resolution.url;
    } else {
      $scope.coverVideo = "";
    }
  };

  /** util to keep refreshing the instagram post */
  $scope.initAutoPostRefresh = function() {
    var refreshInterval = setInterval(function() {
      $scope.instaPost = $scope.instaPosts[$scope.getRandomIntInclusive(0, ($scope.instaPosts.length - 1))];
      $scope.parsePost($scope.instaPost);
      $scope.$apply();
    }, $scope.instaReloadInterval);
  };

  /** Finally, we define getInstaPost to get the post to be displayed randomly selecting it from the data array */
  $scope.getInstaPost = function() {
    $scope.postsPromise = $scope.getInstagramPosts($scope.instaParams);
    $scope.postsPromise.then(function(posts) {
      $scope.instaPosts = posts;
      $scope.instaPost = posts[$scope.getRandomIntInclusive(0, (posts.length - 1))];
      $scope.parsePost($scope.instaPost);
    }, function(err) {
      $scope.handleException(err);
    });
  };

  $scope.getInstaPost();
  $scope.initAutoPostRefresh();

}]);

/** Allow crossdomain video from the Instagram CDN */
myApp.config(function($sceDelegateProvider) {
 $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Allow loading from our assets domain.  Notice the difference between * and **.
   'https://*.cdninstagram.com/**']);
 });
