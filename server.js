'use strict'

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
let request = require('request');
const port = process.env.PORT || 3000;

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
        if (body[0]) {
          resolve(body[0].name)
        } else {
          resolve('-')
        }
      }
    })
  })
}

async function getSearch(url) {
  return new Promise((resolve, reject) => {
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
          result.url = repo.clone_url.slice(0, -4)
          result.tag = await getTags(repo.owner.login, repo.name)
          results.push(result)
        }
        resolve(results)
      } else {
        resolve('Number of API requests exceeded, please try again later.')
      }
    })
  })
}

app.post('/githubsearch', async function (req, res) {
  var url = 'https://api.github.com/search/repositories?q='+req.body.search+'&per_page=10'
  var results = await getSearch(url)
  res.send({results: results})
})

app.listen(port, function() {
    console.log('Server listening on port '+port+'');
});
