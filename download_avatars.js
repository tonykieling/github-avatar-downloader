

var request = require('request');
var fs = require('fs');
var token = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

let repoOwnerF = process.argv[2];
let repoNameF = process.argv[3];

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

function downloadImageByURL(url, filePath) {
  const mkdir = './avatars/';
  if (!fs.existsSync(mkdir)){
    fs.mkdirSync(mkdir);
  }
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
         console.log('Response Status Message: ', response.statusMessage);
         console.log('Content Type: ', response.headers['content-type']);
       })
       .pipe(fs.createWriteStream('./avatars/' + filePath + '.jpeg'));
}


getRepoContributors(repoOwnerF, repoNameF, function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
  let parsedContent = JSON.parse(result);
  console.log(parsedContent);

  parsedContent.forEach(user => {
    downloadImageByURL(user.avatar_url, user.login);
  });
});
