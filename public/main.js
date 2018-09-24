'use strict'

var app = angular.module('shopifyChallenge', []);
app.controller('appCtrlr', function($scope, $http) {

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
      // $http.post('/gettags', {repo: userSearch}).then(
      //   function(res) {
      //     console.log(res);
      //     $scope.tags = res.data.tags
      //   },
      //   function (err) {
      //     console.log(err)
      //   }
      // )
    }

    // $scope.enterSearch = function (e) {
    //   if (e.which == 13) {
    //     $http.post('/searchgithub', {search: $scope.userSearch}).then(
    //       function(res) {
    //         console.log(res);
    //         $scope.results = res.data.results
    //       },
    //       function(err) {
    //         console.log(err);
    //       }
    //     )
    //   }
    // }

});