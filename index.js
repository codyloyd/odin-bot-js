var config = require('./config.js');

var Gitter = require('node-gitter');
var gitter = new Gitter(config.gitter.token);

var Giphy = require('giphy');
var giphy = new Giphy(config.giphy.apikey);

var request = require('request');

var time = 0

// gitter room name from config gets joined, to receive the room id on start
var rooms = config.gitter.rooms
//join all the rooms
for (var i = 0; i < rooms.length; i++) {
  gitter.rooms.join( "TheOdinProject/" + rooms[i])
    .then(function(room) {
      console.log(`Joined room: ${room.name}`);
      listenToMessages(room.id);
    })
    .fail(function(err){
      console.log(`There was an error: ${err}`)
    })
}

function listenToMessages (roomId) {
  gitter.rooms.find(roomId).then(function(room) {
    var events = room.streaming().chatMessages();
    events.on('chatMessages', function(message) {
      //make sure the message is a 'create' message and that it's not "from" the bot
      //can't have him calling himself!
      if (message.operation === 'create' && message.model.fromUser.username != "odin-bot") {

        var messageData = {
          data: message.model,
          text: message.model.text,
          room: room
        }

        for (var i in botFunctions) {
          if (messageData.text.toLowerCase().match(botFunctions[i].condition)){
            botFunctions[i].response(messageData)
          }
        }
      }
    });
  });
}

var botFunctions = {
  giphy: {
    condition: /\/giphy/,
    response: botResponseGiphy
  },
  pointsbot: {
    condition: /@\S+\s?\+\+/,
    response: botResponsePoints
  },
  leaderboard: {
    condition: /^\/leaderboard/,
    response: botResponseLeaderboard
  },
  help: {
    condition: /^\/help|@odin-bot/,
    response: botResponseHelp
  },
  partyparrot: {
    condition: /partyparrot|party_parrot|party parrot/,
    response: botResponsePartyParrot
  },
  windows: {
    condition: /windows/,
    response: botResponseWindows
  },
  hello: {
    condition: /hello odin-bot|hello bot|hi odin-bot|hi bot/,
    response: botResponseHello
  },
  gandalf: {
    condition: /\/gandalf/,
    response: botResponseGandalf
  },
  hug: {
    condition: /\/hug/,
    response: botResponseHug
  }
}

function botResponseGandalf(messageData){
  send(`[![](http://emojis.slackmojis.com/emojis/images/1450458362/181/gandalf.gif)](http://giphy.com/gifs/B3hcUhLX3BFHa/tile)`,messageData.room)
}
function botResponseHug(messageData){
  send(`⊂(´・ω・｀⊂)`,messageData.room)
}
function botResponseHello(messageData){
  send(`oh hi there ${messageData.data.fromUser.displayName}`, messageData.room)
}
function chooseRandomGif(searchTerm) {
  return new Promise(function(resolve, reject) {
    giphy.search({q: searchTerm, limit:10}, function(err, result) {
      if (err) reject('Error');

      if (result.data.length) {
        var image = result.data[randomInt(result.data.length)];
        var imageUrl = image.images.original.url;
        resolve(imageUrl);
      } else {
        resolve(chooseRandomGif('Fail'));
      }
    });
  });
}

function sendRickrollMessages(room) {
  setTimeout(function() {
    send("NEVER GONNA GIVE YOU UP :trollface:", room)
  }, 6000);
  setTimeout(function() {
    send("NEVER GONNA LET YOU DOOOOWWWWN :trollface:", room)
  }, 12000);
}
function botResponseGiphy(messageData) {
  var data = messageData.data;
  var text = messageData.text;
  var room = messageData.room;
  var user = data.fromUser.username;

  var GIPHY = "/giphy";
  var searchTermRegex = new RegExp(GIPHY + "\\s+(.*)");
  // Grab the search term

  if (!text.match(searchTermRegex)) {
    send("use the giphy command with a keyword like so: `/giphy TACOS`", room)
    return
  }
  var searchTerm = text.match(searchTermRegex)[1];
  var mentionRegex = /@\S+/;

  if (text.match(mentionRegex) ){
    user = text.match(mentionRegex)[0].replace('@','');
    searchTerm = searchTerm.replace(mentionRegex, '');
  }

  // replace underscores and colons to spaces because emojis
  searchTerm = searchTerm.replace(/_|:/g, ' ').trim();
  // if there is search text, search after it
  if (searchTerm) {
    if (randomInt(20) == 0) {
      searchTerm = "rickroll";
    }

    chooseRandomGif(searchTerm)
      .then(function(imageUrl){
        var feedContent = `@${user} __${searchTerm}__ \n\n [![${searchTerm}](${imageUrl})](${imageUrl})`;
        send(feedContent, room);
      })
      .catch(function(){
        send("Oops! couldn't serve you", room);
      });

      if (searchTerm === 'rickroll') {
        sendRickrollMessages(room)
      }
  } else {
    // otherwise send an explanation to user
    var help = '@' + user + ': use `/giphy` with a word, to get a gif related to that word, eg. `/giphy cats hats`';
    send(help, room);
  }
}
function botResponsePoints(messageData) {
  var room = messageData.room;
  var text = messageData.text;
  var data = messageData.data;
  var user = data.fromUser.username
  var names = []
  getNamesFromText(text)

  for (var i in names) {
    addPointsToUser(names[i])
  }

  function getNamesFromText(text){
    name = text.match(/@\S+\s?\+\+/)[0]
    text = text.replace(name,'')
    name = name.replace("@","").replace("++","").replace(" ", "")
    names.push(name)
    if (text.match(/@\S+\s?\+\+/)){
      getNamesFromText(text)
    }
  }
  function exclamation(points) {
    if (points < 5) {
      return "Nice!"
    } else if (points < 25) {
      return "Sweet!"
    } else if (points < 99) {
      return "Woot!" 
    } else if (points < 105){
      return "HOLY CRAP!!"
    } else {
      return "Woot!"
    }
  }
  function addPointsToUser(name) {
    if (name.toLowerCase() == user.toLowerCase()) {
      send("![](http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif)", room)
      send("You can't do that!", room)
    } else if ( name == "odin-bot" ){
      send("awwwww shucks... :heart_eyes:",room)
    } else  {
      var time = elapsedTime()
      if (time > 988000) {
        send("calculating points....",room)
      }
      requestUser(name, function(result){
        request(`https://odin-points-bot.herokuapp.com/search/${result.username}?access_token=${config.pointsbot.token}`, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var userJson = JSON.parse(body)
            var points = pointsPluralizer(userJson.points)
            send(`${exclamation(userJson.points)} @${userJson.name} now has ${userJson.points} points` ,room)
          }
        })
      }, function(){
        send(`Hmmm... I don't think I know \`${name}\`: did you spell it correctly?`, room)
      })
    }
  }
}
function botResponseLeaderboard(messageData){
  var room = messageData.room;
  // var time = elapsedTime()
  // if (time > 108000) {
    send("calculating points....",room)
  // }
  request(`https://odin-points-bot.herokuapp.com/users?access_token=${config.pointsbot.token}`, function (error, response, body){
    if (!error && response.statusCode == 200) {
      var users = JSON.parse(body)
      // console.log(users)
      var usersList = ""
      var looplength = function(length) { if (length < 5) { return length} else { return 5 } }(users.length)
      for (var i = 0; i < looplength; i++) {
        if (i == 0) {
          // usersList +=  "  - " + users[i].name + " [" + users[i].points + " points] :tada: \n"
          usersList += ` - ${users[i].name} [${users[i].points} points] :tada: \n`
        } else {
          usersList +=  ` - ${users[i].name} [${users[i].points} points] \n`
        }
      }
      usersList += ` - see the full leaderboard [here](https://odin-bot.github.io) \n`
        send("##leaderboard [![partytime](http://cultofthepartyparrot.com/parrots/parrot.gif)](http://cultofthepartyparrot.com/parrots/parrot.gif) \n" + usersList,room)
    }
  })
}
function botResponseHelp(messageData) {
  send(`> Odin Bot Commands
    > - give points to someone who has been helpful by mentioning their name and adding ++ : \`@username ++\`
    > - view the points leaderboard with \`/leaderboard\`
    > - To view or join the rest of the Odin chatrooms click [HERE](https://gitter.im/orgs/TheOdinProject/rooms).
    > - share a nice gif with your friends with \`/giphy\` and another word
    > - For help with gitter commands (and \`code\` syntax)press \`ctl+shift+alt+m\`
    > - say my name, or \`/help\` to view this message again
    > - I'm open source!  Hack me [HERE](https://github.com/codyloyd/odin-bot-js)!`,messageData.room)
}
function botResponsePartyParrot(messageData){
  var room = messageData.room;
  var text = messageData.text;
  var parrots = [
    "http://cultofthepartyparrot.com/parrots/parrotdad.gif",
    "http://cultofthepartyparrot.com/parrots/parrot.gif",
    "http://cultofthepartyparrot.com/parrots/shuffleparrot.gif",
    "http://cultofthepartyparrot.com/parrots/parrotcop.gif",
    "http://cultofthepartyparrot.com/parrots/fiestaparrot.gif",
    "http://cultofthepartyparrot.com/parrots/explodyparrot.gif",
    "http://cultofthepartyparrot.com/parrots/aussieparrot.gif",
    "http://emojis.slackmojis.com/emojis/images/1450738632/246/leftshark.png",
    "http://emojis.slackmojis.com/emojis/images/1472757675/1132/otter-dance.gif"
  ]

  if (text.toLowerCase().match("   p")) {
    var parrotUrl = "http://cultofthepartyparrot.com/parrots/congaparrot.gif"

    send(`![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})`,room)

  } else if (text.toLowerCase().match("!")) {
    send(`![](${parrots[0]})`,room)
  } else {
    var index = randomInt(parrots.length)
    send(`![]( ${parrots[index]} )`,room)
  }
}
function botResponseWindows(messageData){
  var room = messageData.room;
  if (parseInt(Math.random()*10) == 0){
    send("![](http://i.imgur.com/q9s5OKr.gif)", room)
    send("##did I hear someone say something about WINDOWS?",room)
  }
}




var counter = 0

function randomInt(range) {
  return parseInt(Math.random() * range);
}

//record time of event
function getTime () {
  return new Date().getTime()
}

function elapsedTime() {
  var elapsedSeconds = (getTime() - time) / 1000
  time = getTime()
  return elapsedSeconds
}

function pointsPluralizer(points) {
  if (points == 1) {
    return "point"
  } else {
    return "points"
  }
}

function requestUser (username, callback, errorcallback) {
  request({url: "https://api.gitter.im/v1/user?q=" + username, headers: {Authorization: "Bearer " + config.gitter.token}}, function (error, response, body){
    if (!error && response.statusCode == 200) {
      var user = JSON.parse(body).results[0]
      if (user && user.username.toLowerCase() == username.toLowerCase()) {
        callback(user)
      } else {
        errorcallback()
      }
    }
  })
}

function send (message, room) {

  // switch, where the message should be sent
  switch (config.gitter.place) {
    case 'activity':
      request.post(config.gitter.webhook).form({message: message});
      break;

    case 'chat':
      room.send(message);
      break;

    default:
      console.log(message);
      break;
  }
}
