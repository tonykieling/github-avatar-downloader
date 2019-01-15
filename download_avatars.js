

var request = require('request');
var fs = require('fs');
var token = require('./secrets.js');

console.log('Welcome to the GitHub Avatar Downloader!');

let repoOwnerF = process.argv[2];
let repoNameF = process.argv[3];

if ((!repoOwnerF) || (!repoNameF)){
  console.log("Please, especiffy the Owner and the RepoName");
  console.log("i.e. => node download_avatars.js jquery jquery");
  return;
}

function getRepoContributors(repoOwner, repoName, cb) {
  console.log('starting...');
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
    console.log('done');
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
       })
       .pipe(fs.createWriteStream('./avatars/' + filePath + '.jpeg'));
}


getRepoContributors(repoOwnerF, repoNameF, function(err, result) {
  let parsedContent = JSON.parse(result);
  parsedContent.forEach(user => {
    downloadImageByURL(user.avatar_url, user.login);
  });
});
