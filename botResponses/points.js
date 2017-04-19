'use strict'

var time
var request = require('request')
var config = require('../config.js')
var {
  getNamesFromText,
  elapsedTime,
  requestUser,
  pointsPluralizer,
  exclamation
} = require('../helpers/helpers.js')
var chatHelpers = require('../helpers/chatHelpers.js')

function botResponsePoints({data, text, room}) {
  const requesterName = data.fromUser.username
  const names = getNamesFromText(text)

  names.forEach(name => addPointsToUser(name))

  function addPointsToUser(name) {
    if (name.toLowerCase() == requesterName.toLowerCase()) {
      chatHelpers.send(
        '![](http://media0.giphy.com/media/RddAJiGxTPQFa/200.gif)',
        room
      )
      chatHelpers.send("You can't do that!", room)
    } else if (name === 'odin-bot') {
      chatHelpers.send('awwwww shucks... :heart_eyes:', room)
    } else {
      time = elapsedTime()
      if (time > 988000) chatHelpers.send('calculating points....', room)

      requestUser(
        name,
        function(result) {
          request(
            `https://odin-points-bot.herokuapp.com/search/${result.username}?access_token=${config.pointsbot.token}`,
            function(error, response, body) {
              if (!error && response.statusCode == 200) {
                var userJson = JSON.parse(body)
                var points = pointsPluralizer(userJson.points)
                chatHelpers.send(
                  `${exclamation(userJson.points)} @${userJson.name} now has ${userJson.points} ${points}`,
                  room
                )
              }
            }
          )
        },
        function() {
          chatHelpers.send(
            `Hmmm... I don't think I know \`${name}\`: did you spell it correctly?`,
            room
          )
        }
      )
    }
  }
}

function botResponseLeaderboard({room}) {
  chatHelpers.send('calculating points....', room)

  request(
    `https://odin-points-bot.herokuapp.com/users?access_token=${config.pointsbot.token}`,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var users = JSON.parse(body)
        var usersList = ''
        var looplength = (function(length) {
          if (length < 5) {
            return length
          } else {
            return 5
          }
        })(users.length)

        for (var i = 0; i < looplength; i++) {
          if (i == 0) {
            usersList += ` - ${users[i].name} [${users[i].points} points] :tada: \n`
          } else {
            usersList += ` - ${users[i].name} [${users[i].points} points] \n`
          }
        }

        usersList += ` - see the full leaderboard [here](https://odin-bot.github.io) \n`
        chatHelpers.send(
          '##leaderboard [![partytime](http://cultofthepartyparrot.com/parrots/parrot.gif)](http://cultofthepartyparrot.com/parrots/parrot.gif) \n' +
            usersList,
          room
        )
      }
    }
  )
}

module.exports = {botResponsePoints, botResponseLeaderboard}
