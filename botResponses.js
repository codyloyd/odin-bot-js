'use strict';

var request = require('request');
var config = require('./config.js');

var Giphy = require('giphy');
var giphy = new Giphy(config.giphy.apikey);

var helpers = require('./helpers/helpers.js');
var chatHelpers = require('./helpers/chatHelpers.js');

function botResponseUseLinux(messageData) {
  chatHelpers.send(`[Why you shouldn't use Windows for TOP.](https://medium.com/@codyloyd/why-cant-i-use-windows-for-the-odin-project-bf20a4bb135f#.29b6s6fp5)`, messageData.room);
}

function botResponseGandalf(messageData) {
  chatHelpers.send(`[![](http://emojis.slackmojis.com/emojis/images/1450458362/181/gandalf.gif)](http://giphy.com/gifs/B3hcUhLX3BFHa/tile)`, messageData.room);
}

function botResponseHug(messageData) {
  chatHelpers.send(`⊂(´・ω・｀⊂)`, messageData.room);
}

function botResponseHello(messageData) {
  chatHelpers.send(`oh hi there ${messageData.data.fromUser.displayName}`, messageData.room);
}

function chooseRandomGif(searchTerm) {
  return new Promise(function(resolve, reject) {
    giphy.search({ q: searchTerm, limit: 25 }, function(err, result) {
      if (err) reject('error');

      if (result.data.length) {
        var randomIndex = helpers.randomInt(result.data.length);
        var image = result.data[randomIndex];
        var imageUrl = image.images.original.url;
        resolve(imageUrl);
      } else {
        reject('no gif');
      }
    });
  });
}

function sendRickrollMessages(room) {
  setTimeout(function() {
    chatHelpers.send('OOOOH YEAH', room)
    }, 6000
  );

  setTimeout(function() {
    chatHelpers.send('SAVAGE :trollface:', room)
    }, 8000
  );
}

function botResponseGiphy(messageData) {
  var data = messageData.data;
  var text = messageData.text;
  var room = messageData.room;
  var user = data.fromUser.username;

  var GIPHY = '/giphy';
  var searchTermRegex = new RegExp(GIPHY + '\\s+(.*)');

  if (!text.match(searchTermRegex))
    return chatHelpers.send('use the giphy command with a keyword like so: `/giphy TACOS`', room);
  
  var searchTerm = text.match(searchTermRegex)[1];
  console.log(`Searching for ${searchTerm}`);
  var mentionRegex = /@([a-zA-Z0-9-_]+)/;

  if (mentionRegex.test(text)) {
    user = text.match(mentionRegex)[1];
    searchTerm = searchTerm.replace(mentionRegex, '');
  }

  // replace underscores and colons to spaces because emojis
  searchTerm = searchTerm.replace(/_|:/g, ' ').trim();

  // if there is search text, search after it
  if (searchTerm) {
    if (helpers.randomInt(20) == 0)
      searchTerm = 'Randy Savage!!';

    chooseRandomGif(searchTerm)
      .then(function(imageUrl) {
        var feedContent = `@${user} __${searchTerm}__ \n\n [![${searchTerm}](${imageUrl})](${imageUrl})`;
        chatHelpers.send(feedContent, room);
      })
      .catch(function() {
        chooseRandomGif('FAIL')
          .then(function(imageUrl) {
            chatHelpers.send(`__no gif was found with that keyword!__ \n\n !["FAIL"](${imageUrl})`, room);
          })
          .catch(function() {
            chatHelpers.send("there was an error", room);
          })
      });

    if (searchTerm === 'Randy Savage!!') {
      sendRickrollMessages(room)
    }
  } else {
    // otherwise send an explanation to user
    var help = '@' + user + ': use `/giphy` with a word, to get a gif related to that word, eg. `/giphy cats hats`';
    chatHelpers.send(help, room);
  }
}

function botResponsePoints(messageData) {
  var room = messageData.room;
  var text = messageData.text;
  var data = messageData.data;
  var requesterName = data.fromUser.username;
  var names = getNamesFromText(text);

  for (var i in names)
    addPointsToUser(names[i]);

  function addPointsToUser(name) {
      if (name === 'Techgeek9') {
        //double points for this dude cause he's so cooool
        helpers.requestUser(name, function(result) {
          request(`https://odin-points-bot.herokuapp.com/search/${result.username}?access_token=${config.pointsbot.token}`)
        });
      }

      if (name.toLowerCase() == requesterName.toLowerCase()) {
        chatHelpers.send('![](http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif)', room);
        chatHelpers.send("You can't do that!", room);
      } else if (name === 'odin-bot') {
        chatHelpers.send('awwwww shucks... :heart_eyes:', room);
      } else  {
        var time = helpers.elapsedTime();
        if (time > 988000)
          chatHelpers.send('calculating points....', room);

        helpers.requestUser(name, function(result) {
          request(`https://odin-points-bot.herokuapp.com/search/${result.username}?access_token=${config.pointsbot.token}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var userJson = JSON.parse(body);
              var points = helpers.pointsPluralizer(userJson.points);
              chatHelpers.send(`${helpers.exclamation(userJson.points)} @${userJson.name} now has ${userJson.points} points`, room);
            }
          })
        }, function() {
          chatHelpers.send(`Hmmm... I don't think I know \`${name}\`: did you spell it correctly?`, room);
        });
      }
    }
}

function getNamesFromText(text) {
  var regex = /@([a-zA-Z0-9-_]+)\s?\+\+/g,
      matches = [],
      match;
  while ((match = regex.exec(text)) !== null)
    matches.push(match[1]);
  return matches;
}


function botResponseLeaderboard(messageData) {
  var room = messageData.room;

  chatHelpers.send('calculating points....', room);

  request(`https://odin-points-bot.herokuapp.com/users?access_token=${config.pointsbot.token}`,
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var users = JSON.parse(body);
        var usersList = '';
        var looplength = function(length) { if (length < 5) { return length } else { return 5 } }(users.length);

        for (var i = 0; i < looplength; i++) {
          if (i == 0) {
            usersList += ` - ${users[i].name} [${users[i].points} points] :tada: \n`
          } else {
            usersList +=  ` - ${users[i].name} [${users[i].points} points] \n`
          }
        }

        usersList += ` - see the full leaderboard [here](https://odin-bot.github.io) \n`
          chatHelpers.send('##leaderboard [![partytime](http://cultofthepartyparrot.com/parrots/parrot.gif)](http://cultofthepartyparrot.com/parrots/parrot.gif) \n' + usersList, room);
      }
    }
  )
}

function botResponseHelp(messageData) {
  chatHelpers.send(`> Odin Bot Commands
    > - give points to someone who has been helpful by mentioning their name and adding ++ : \`@username ++\`
    > - view the points leaderboard with \`/leaderboard\`
    > - To view or join the rest of the Odin chatrooms click [HERE](https://gitter.im/orgs/TheOdinProject/rooms).
    > - share a nice gif with your friends with \`/giphy\` and another word
    > - For help with gitter commands (and \`code\` syntax)press \`ctl+shift+alt+m\`
    > - say my name, or \`/help\` to view this message again
    > - motivate your fellow odinites with \`/motivate\` and mention them
    > - I'm open source!  Hack me [HERE](https://github.com/codyloyd/odin-bot-js)!`, messageData.room)
}

function botResponsePartyParrot(messageData) {
  var room = messageData.room;
  var text = messageData.text;
  var parrots = [
    'http://cultofthepartyparrot.com/parrots/parrotdad.gif',
    'http://cultofthepartyparrot.com/parrots/parrot.gif',
    'http://cultofthepartyparrot.com/parrots/shuffleparrot.gif',
    'http://cultofthepartyparrot.com/parrots/parrotcop.gif',
    'http://cultofthepartyparrot.com/parrots/fiestaparrot.gif',
    'http://cultofthepartyparrot.com/parrots/explodyparrot.gif',
    'http://cultofthepartyparrot.com/parrots/aussieparrot.gif',
    'http://emojis.slackmojis.com/emojis/images/1450738632/246/leftshark.png',
    'http://emojis.slackmojis.com/emojis/images/1472757675/1132/otter-dance.gif'
  ];

  if (text.toLowerCase().match('   p')) {
    var parrotUrl = 'http://cultofthepartyparrot.com/parrots/congaparrot.gif';

    chatHelpers.send(`![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})`, room);

  } else if (text.toLowerCase().match("!")) {
    chatHelpers.send(`![](${parrots[0]})`, room);
  } else {
    var index = helpers.randomInt(parrots.length);
    chatHelpers.send(`![]( ${parrots[index]} )`, room);
  }
}

function botResponseWindows(messageData){
  var room = messageData.room;
  if (parseInt(Math.random() * 15) == 0) {
    chatHelpers.send("![](http://i.imgur.com/q9s5OKr.gif)", room);
    chatHelpers.send("##did I hear someone say something about WINDOWS?", room);
  }
}

function botResponseDontGiveUp(messageData) {
  var room = messageData.room;
  var user = messageData.data.fromUser.username;
  var mentions = helpers.getMentions(messageData.text);

  if (mentions) mentions = mentions.join(' ');
  else mentions = `@${user}`; // if no one is mentioned, tag the requester

  chatHelpers.send(`${mentions} Don't give up! https://www.youtube.com/watch?v=KxGRhd_iWuE`, room);
}


exports.botResponseUseLinux = botResponseUseLinux;
exports.botResponseGandalf = botResponseGandalf;
exports.botResponseHug = botResponseHug;
exports.botResponseHello = botResponseHello;
exports.botResponseGiphy = botResponseGiphy;
exports.botResponsePoints = botResponsePoints;
exports.botResponseLeaderboard = botResponseLeaderboard;
exports.botResponseHelp = botResponseHelp;
exports.botResponsePartyParrot = botResponsePartyParrot;
exports.botResponseWindows = botResponseWindows;
exports.botResponseDontGiveUp = botResponseDontGiveUp;
