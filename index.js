var Gitter = require('node-gitter');
var request = require('request');
var Giphy = require('giphy');

// get configuration infos from config.js file
// if non available, copy config.example.js and fill out the
var config = require('./config.js');
var time = 0

var gitter = new Gitter(config.gitter.token);
var giphy = new Giphy(config.giphy.apikey);

// gitter room name from config gets joined, to receive the room id on start
var rooms = config.gitter.rooms
for (var i = 0; i < rooms.length; i++) {
  gitter.rooms.join( "TheOdinProject/" + rooms[i] , function(err, room) {
    if (err) {
      return;
    }
    config.gitter.room.id = room.id;
    // start the message listener
    listenToMessages();
  })
}

function listenToMessages () {
  gitter.rooms.find(config.gitter.room.id).then(function(room) {
    var events = room.streaming().chatMessages();
    // The 'snapshot' event is emitted once, with the last messages in the room
    events.on('snapshot', function(snapshot) {
      console.log(snapshot.length + ' messages in the snapshot');
    });
    // event gets called, when a new message gets written in the configured channel
    events.on('chatMessages', function(message) {
      // the bot only evaluates new messages, no updates or other changes
      if (message.operation === 'create' && message.model.fromUser.username != "odin-bot") {
        var data = message.model;
        var text = data.text;
        // text contains the giphy command
        if (text.match(config.giphy.regex)) {
          var user = data.fromUser.username;
          var search = text.replace(config.giphy.regex, '');
          // replace underscores and colons to spaces because emojis
          search = search.replace(/_|:/g, ' ').trim();
          // if there is search text, search after it
          if (search) {
            if (parseInt(Math.random()*20) == 0) {
              search = "rickroll"
            }
            giphy.search({q: search, limit: 20}, function (err, result, res) {
              // if there are results, send a random one
              if (result.data.length) {
                var image = result.data[parseInt(Math.random()*result.data.length)];
                var imgurl = image.images.original.url;
                var feedcontent =  '@' + user + ' : __'+ search +'__ \n\n[!['+search+'](' + imgurl + ')](' + image.url + ')';
                send(feedcontent, room);
                if (search == "rickroll") {
                  setTimeout(function(){
                    send("NEVER GONNA GIVE YOU UP :trollface:", room)
                  }, 6000)
                  setTimeout(function(){
                    send("NEVER GONNA LET YOU DOOOOWWWWN :trollface:", room)
                  }, 12000)
                }
              } else {
                // otherwise send a message, that there are no gifs with that search
                var help = '@' + user + ': there is no gif with those words';
                send(help, room);
                giphy.search({q: "FAIL", limit: 10}, function (err, result, res) {
                  if (result.data.length) {
                    var image = result.data[parseInt(Math.random()*result.data.length)]
                    var imgurl = image.images.original.url;
                    send("![](" + imgurl + ")",room)
                  }
                })
              }

            });
          } else {
            // otherwise send an explanation to user
            var help = '@' + user + ': use `/giphy` with a word, to get a gif related to that word, eg. `/giphy cats hats`';
            send(help, room);
          }
        // text contains the ++ command
        } else if (text.match(config.pointsbot.regex)) {
          name = text.match(/@\S+\s?\+\+/)[0]
          name = name.replace("@","")
          name = name.replace("++","")
          name = name.replace(" ", "")
          var user = data.fromUser.username
          if (name.toLowerCase() == user.toLowerCase()) {
            send("![](http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif)", room)
            send("You can't do that!", room)
          } else if ( name == "odin-bot" ){
            send("awwwww shucks... :heart_eyes:",room)
          } else  {
            var time = elapsedTime()
            if (time > 108000) {
              send("calculating points....",room)
            }
            requestUser(name, function(result){
              request('https://odin-points-bot.herokuapp.com/search/' + result.username + "?access_token=" + config.pointsbot.token, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  var userJson = JSON.parse(body)
                  var points = pointsPluralizer(userJson.points)
                  send("Sweet! @" + userJson.name + " now has " + userJson.points + " " + points ,room)
                }
              })
            }, function(){
              send("Hmmm... I don't think I know `" + name + "`: did you spell it correctly?", room)
            })
          }
        //text contains the leaderboard command
        } else if (text.match("/leaderboard")){
          var time = elapsedTime()
          if (time > 108000) {
            send("calculating points....",room)
          }
          request('https://odin-points-bot.herokuapp.com/users?access_token=' + config.pointsbot.token, function (error, response, body){
            if (!error && response.statusCode == 200) {
              var users = JSON.parse(body)
              // console.log(users)
              var usersList = ""
              var looplength = function(length) { if (length < 5) { return length} else { return 5 } }(users.length)
              for (var i = 0; i < looplength; i++) {
                if (i == 0) {
                  usersList +=  "  - " + users[i].name + " [" + users[i].points + " points] :tada: \n"
                } else {
                  usersList +=  "  - " + users[i].name + " [" + users[i].points +  " points]\n"
                }

              }
                send("##leaderboard [![partytime](http://cultofthepartyparrot.com/parrots/parrot.gif)](http://cultofthepartyparrot.com/parrots/parrot.gif) \n" + usersList,room)
            }
          })
        } else if (text.match("@odin-bot")||text.match("/help")) {
          send("> Odin Bot Commands \n\n > - give points to someone who has been helpful by mentioning their name and adding ++ : `@username ++`\n\n > - view the points leaderboard with `/leaderboard`\n\n> - To view or join the rest of the Odin chatrooms click [HERE](https://gitter.im/orgs/TheOdinProject/rooms). \n\n > - share a nice gif with your friends with `/giphy` and another word \n\n > - For help with gitter commands (and `code` syntax)press `ctl+shift+alt+m` \n\n> - say my name, or `/help` to view this message again \n\n> - if you have any complaints about the bot, message " + randomMod() + ":trollface:",room)
        } else if (text.match("   partyparrot")){
          send("![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)![](http://cultofthepartyparrot.com/parrots/congaparrot.gif)",room)
        } else if (text.toLowerCase().match("partyparrot") || text.toLowerCase().match("party_parrot")){
          var parrots = ["http://cultofthepartyparrot.com/parrots/parrot.gif","http://cultofthepartyparrot.com/parrots/shuffleparrot.gif","http://cultofthepartyparrot.com/parrots/parrotcop.gif","http://cultofthepartyparrot.com/parrots/parrotdad.gif","http://cultofthepartyparrot.com/parrots/fiestaparrot.gif","http://cultofthepartyparrot.com/parrots/explodyparrot.gif","http://cultofthepartyparrot.com/parrots/aussieparrot.gif"]
          var index = randomInt(parrots.length)
          send("![](" + parrots[index] + ")",room)
        }else if (text.toLowerCase().match("windows")) {
          if (parseInt(Math.random()*10) == 0){
            send("![](http://i.imgur.com/q9s5OKr.gif)", room)
            send("##did I hear someone say something about WINDOWS?",room)
          }
        } else if (text.match("food")){
          send("hungry? How about some PIZZA",room)
          send("![](http://i.giphy.com/yoJC2EyuKmTUgjlTgY.gif)",room)
        } else if (text.toLowerCase().match("recursion") || text.toLowerCase().match("recursive")) {
          var time = elapsedTime()
          if (time > 108000) {
            send("did someone say something about _recursion?_", room)
            setTimeout(function(){
              send("did someone say something about _recursion?_", room)
            }, 2000)
            setTimeout(function(){
              send("did someone say something about _recursion?_", room)
            }, 5000)
            setTimeout(function(){
              send("did someone say something about _recursion?_", room)
            }, 8000)
            setTimeout(function(){
              send("hehe.. just joking :trollface:", room)
            }, 12000)
          } else {
            send("OK... I think we've had enough of that joke for now",room)
          }
        }
      }
    });
  });
}

var counter = 0
function randomMod(){
  var mods = ["Kevin, he's the boss around here anyway.","csrail, it's all his fault","Jimmie... just cause","anyone but cody... seriously he doesn't have anything to do with this."]
  counter += 1
  return mods[counter % mods.length]
}
function randomInt(range) {
  return parseInt(Math.random()*range)
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
      if (user) {
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
