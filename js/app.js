var myApp = angular.module("myApp", []);

myApp.controller("myAppCtrl", [ "$scope", "$http", function($scope, $http) {
  $scope.posts = [], // This will contain all the instagram posts
  $scope.post = {},
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

  $scope.getInstagramPosts = function(params) {
    $http.jsonp($scope.buildInstagramURI(params))
    .success(function(result, status, headers, config) {
      return result.data;
    }).
    error(function(result, status, headers, config) {
      $scope.handleException(result, status, headers, config);
    });
  };

  $scope.posts = $scope.getInstagramPosts($scope.instaParams);
  //$scope.post = $scope.posts[$scope.getRandomIntInclusive(0, ($scope.posts.length - 1))];

}]);
