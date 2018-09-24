'use strict'

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
let request = require('request');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

function getTags(owner, name) {
  return new Promise((resolve, reject) => {
    request({
      headers: { 'User-Agent': 'rileythomp'},
      url: 'https://api.github.com/repos/'+owner+'/'+name+'/tags',
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body)
      }
    })
  })
}

async function getSearch(url) {
  try {
    request({
      headers: {'User-Agent': 'rileythomp'},
      url: url,
      json: true
    }, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var results = []
        for (var i = 0; i < body.items.length; ++i) {
          var repo = body.items[i]
          var result = {}
          result.owner = repo.owner.login
          result.name = repo.name
          result.language = repo.language
          result.tag = await getTags(repo.owner.login, repo.name)
          results.push(result)
        }
        return results
      }
    })
  } catch (e) {
    console.error('ERROR:', error)
  }
}

// app.post('/githubsearch', function (req, res) {
//   var url = 'https://api.github.com/search/repositories?q='+req.body.search+'&per_page=10'
//   var results = getSearch(url)
//   res.send({results: results})
// })



// app.post('/searchgithub', function (req, res) {
//   var url = 'https://api.github.com/search/repositories?q='+req.body.search+'&per_page=10'
//   request({
//     headers: {'User-Agent': 'rileythomp'},
//     url: url,
//     json: true
//   }, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var results = []
//       for (var i = 0; i < body.items.length; ++i) {
//         var repo = body.items[i]
//         var result = {}
//         result.owner = repo.owner.login
//         result.name = repo.name
//         result.language = repo.language
//         results.push(result)
//       }
//       res.send({results: results})
//     }
//   })
// });

// app.post('/gettags', function (req, res) {
//   var url = 'https://api.github.com/search/repositories?q='+req.body.search+'&per_page=10'
//   request({
//     headers: {'User-Agent': 'rileythomp'},
//     url: url,
//     json: true
//   }, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var tags = []
//       for (var i = 0; i < body.items.length; ++i) {
//         var repo = body.items[i]
//         var name = repo.name
//         var owner = repo.owner.login
//         request({
//           headers: { 'User-Agent': 'rileythomp'},
//           url: 'https://api.github.com/repos/'+owner+'/'+name+'/tags',
//           json: true
//         }, function (error, response, body) {
//           if (!error && response.statusCode == 200) {
//             tags.push(body[0])
//           }
//         })
//       }
//     }
//   })
// });

app.listen(3000, function() {
    console.log('Server listening on port 3000');
});
