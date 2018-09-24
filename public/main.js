'use strict'

var app = angular.module('shopifyChallenge', []);
app.controller('appCtrlr', function($scope, $http) {

  $scope.$watch('$viewContentLoaded', function() {
    $scope.favourites = JSON.parse(localStorage.getItem('favourites'))
  });

    $scope.searchGithub = function (userSearch) {
      $http.post('/githubsearch', {search: userSearch}).then(
        function(res) {
          console.log(res)
          $scope.results = res.data.results
        },
        function(err) {
          console.log(err)
        }
      )
    }

    $scope.enterSearch = function (e) {
      if (e.which == 13) {
        $http.post('/githubsearch', {search: $scope.userSearch}).then(
          function(res) {
            console.log(res);
            $scope.results = res.data.results
          },
          function(err) {
            console.log(err);
          }
        )
      }
    }

    $scope.addFavourite = function (e) {
      var newFav = $(e.target).data('repo')
      $scope.favourites.push(newFav)
      localStorage.setItem('favourites', JSON.stringify($scope.favourites))
    }

    $scope.removeFavourite = function (e) {
      //console.log(JSON.stringify($(e).data('favourite')))
      console.log('hi')
    }

});