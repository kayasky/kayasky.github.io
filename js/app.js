'use strict';

var myApp = angular.module("myApp", []);

myApp.controller("myAppCtrl", [ "$scope", "$http", "$q", function($scope, $http, $q) {
  var instaPosts = [], // This will contain all the instagram posts
    instaPost = {},
    instaReloadInterval = 8000,
    instaParams = {
      "uid": "2966059",
      "client_id": "1716a38e53104ce5b87665e86faad108"
    }; //instagram constants

  $scope.coverImage = "";
  $scope.coverVideo = "";

  var buildInstagramURI = function(params) {
    return "https://api.instagram.com/v1/users/" + params.uid + "/media/recent/?client_id=" + params.client_id + "&callback=JSON_CALLBACK";
  };

  var getRandomIntInclusive = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var handleException = function() {
    console.log(arguments);
  };

  /** This returns a promise with the instagram posts */
  var getInstagramPosts = function(params) {
    return $q(function(resolve, reject) {
      $http.jsonp(buildInstagramURI(params))
        .success(function(result, status, headers, config) {
          resolve(result.data);
        }).
        error(function(result, status, headers, config) {
          reject(result, status, headers, config);
        });
    });
  };

  var parsePost = function(post) {
    $scope.coverImage = post.images.standard_resolution.url;
    if (post.videos) {
      $scope.coverVideo = post.videos.standard_resolution.url;
    } else {
      $scope.coverVideo = "";
    }
  };

  /** util to keep refreshing the instagram post */
  var initAutoPostRefresh = function() {
    var refreshInterval = setInterval(function() {
      instaPost = instaPosts[getRandomIntInclusive(0, (instaPosts.length - 1))];
      parsePost(instaPost);
      $scope.$apply();
    }, instaReloadInterval);
  };

  /** Finally, we define getInstaPost to get the post to be displayed randomly selecting it from the data array */
  var getInstaPost = function() {
    var postsPromise = getInstagramPosts(instaParams);
    postsPromise.then(function(posts) {
      instaPosts = posts;
      instaPost = posts[getRandomIntInclusive(0, (posts.length - 1))];
      parsePost(instaPost);
    }, function(err) {
      handleException(err);
    });
  };

  getInstaPost();
  initAutoPostRefresh();

}]);

/** Allow crossdomain video from the Instagram CDN */
myApp.config(function($sceDelegateProvider) {
 $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Allow loading from our assets domain.  Notice the difference between * and **.
   'https://*.cdninstagram.com/**']);
 });
