'use strict'

var app = angular.module('shopifyChallenge', []);
app.controller('appCtrlr', function($scope, $http) {

    let githubSearch = function (userSearch) {
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

    $scope.searchGithub = function (userSearch) {
      githubSearch(userSearch)
    }

    $scope.enterSearch = function (e) {
      if (e.which == 13) {
        githubSearch($scope.userSearch)
      }
    }

    $scope.addFavourite = function (e) {
      var newFav = $(e.target).data('repo')
      var favs = JSON.parse(localStorage.getItem('favourites'))
      favs.push(newFav)
      localStorage.setItem('favourites', JSON.stringify(favs))
      $('#favouritesTable').append($('<tr>')
      .append($('<td>').text(newFav.owner + '/' + newFav.name))
      .append($('<td>').text(newFav.language))
      .append($('<td>').text(newFav.tag))
      .append($('<td class="favourite" data-favourite="'+JSON.stringify(newFav).replace(/"/g, "`")+'">').text('Remove')))
    }

    $(document).ready(function () {
      var savedFavs = JSON.parse(localStorage.getItem('favourites')) || []
      for (var i = 0; i < savedFavs.length; ++i) {
        $('#favouritesTable').append($('<tr>')
        .append($('<td>').text(savedFavs[i].owner + '/' + savedFavs[0].name))
        .append($('<td>').text(savedFavs[i].language))
        .append($('<td>').text(savedFavs[i].tag))
        .append($('<td class="favourite" data-favourite="'+JSON.stringify(savedFavs[i]).replace(/"/g, "`")+'">').text('Remove')))
      }
    })

    $('#favouritesTable').on('click', '.favourite', function (e) {
      var savedFavs = JSON.parse(localStorage.getItem('favourites')) || []
      var removedFav = JSON.parse($(e.target).data('favourite').replace(/`/g, '"'))
      var newFavs = savedFavs.filter(function(el) { return el.name != removedFav.name; }); 
      localStorage.setItem('favourites', JSON.stringify(newFavs))
      $(e.target.parentElement).remove()
    })

});