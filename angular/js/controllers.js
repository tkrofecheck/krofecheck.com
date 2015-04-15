var myApp = angular.module('myApp', []);

myApp.controller('MyController', ['$scope', '$http', function($scope, $http) {
  $http.get('js/data/about.json').success(function(data) {
    $scope.about = data;
  });
  $http.get('js/data/portfolio.json').success(function(data) {
    $scope.portfolio = data;
  });
  $http.get('js/data/resume.json').success(function(data) {
    $scope.resume = data;
  });
}]);