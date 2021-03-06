'use strict'

var app = angular.module('shopifyChallenge', []);
app.controller('appCtrlr', function($scope, $http) {

    let isFavourite = function (repo, savedFavs) {
      for (var i = 0; i < savedFavs.length; i++) {
          if (savedFavs[i].name == repo.name) {
              return true;
          }
      }
      return false;
    }

    let githubSearch = function (userSearch) {
      $('.fa-spinner').show()
      $scope.noResults = false
      $scope.maxRequests = false
      $http.post('/githubsearch', {search: userSearch}).then(
        function(res) {
          console.log(res)
          var results = res.data.results
          var savedFavs = JSON.parse(localStorage.getItem('favourites')) || []
          for (var i = 0; i < results.length; ++i) {
            var repo = results[i]
            if (isFavourite(repo, savedFavs)) {
              repo.notFav = false
            } else {
              repo.notFav = true
            }
          }
          if (results[0] == 'N') {
	          $scope.maxRequests = true
	        } else if (results.length) {
            $scope.results = results
          } else {
            $scope.noResults = true;
          }
          $('.fa-spinner').hide()
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
        $scope.noResults = false
        $scope.maxRequests = false
        githubSearch($scope.userSearch)
      } else if (!$scope.userSearch) {
        $scope.noResults = false
        $scope.maxRequests = false
        $scope.results = []
      }
    }

    /* Would have liked to not use so much jQuery here, but
       couldn't get ng-repeat working and ran out of time. */

    $scope.addFavourite = function (e) {
      var newFav = $(e.target).data('repo')
      var favs = JSON.parse(localStorage.getItem('favourites')) || []
      favs.push(newFav)
      localStorage.setItem('favourites', JSON.stringify(favs))
      $('#favouritesTable').append($('<tr>')
      .append($('<td>').text(newFav.owner + '/' + newFav.name))
      .append($('<td>').text(newFav.language))
      .append($('<td>').text(newFav.tag))
      .append($('<td class="favourite" data-favourite="'+JSON.stringify(newFav).replace(/"/g, "`")+'">').text('Remove')))
      $(e.target).remove()
    }

    $(document).ready(function () {
      var savedFavs = JSON.parse(localStorage.getItem('favourites')) || []
      for (var i = 0; i < savedFavs.length; ++i) {
        var savedFav = savedFavs[i]
        $('#favouritesTable').append($('<tr>')
        .append($('<td>').html('<a href="'+savedFav.url+'">'+savedFav.owner+'/'+savedFav.name+'</a>'))
        .append($('<td>').text(savedFav.language))
        .append($('<td>').text(savedFav.tag))
        .append($('<td class="favourite" data-favourite="'+JSON.stringify(savedFav).replace(/"/g, "`")+'">').text('Remove')))
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
