'use strict'

var request = require('request')
var config = require('../config.js')
var winston = require('winston');
var time
var chuck = require('chucky.js');

var apiai = require('apiai')
var aiapp = apiai(config.apiai.apikey)
var weatherKey = config.weatherAPI.weatherApiKey

var helpers = require('../helpers/helpers.js')
var chatHelpers = require('../helpers/chatHelpers.js')
var { respondWithGif } = require('./giphy')

// function botResponseChat({room, text}) {
//   var request = aiapp.textRequest(text, {
//     sessionId: '14'
//   })
//   request.on('response', function(response) {
//     // console.log(response)
//     const speech = response.result.fulfillment.speech
//     const action = response.result.action
//     if (speech) {
//       chatHelpers.send(speech, room)
//     }
//     if (action == 'sendGif') {
//       respondWithGif('hi', room)
//     }
//   })
//   request.on('error', function(error) {
//     console.log(error)
//   })
//   request.end()
// }

// function respondWithGif(searchTerm, room) {
//   const gifs = ['hi', 'love', 'pizza', 'kiss']
//   chooseRandomGif(gifs[helpers.randomInt(gifs.length)])
//     .then(function(image) {
//       var feedContent = `[![](${image.imageUrl})](${image.url})`
//       chatHelpers.send(feedContent, room)
//     })
//     .catch(function() {
//       chatHelpers.send('there was an error', room)
//     })
// }

function botResponseUseLinux({ room }) {
  chatHelpers.send(
    `[Why you shouldn't use Windows for TOP.](https://medium.com/@codyloyd/why-cant-i-use-windows-for-the-odin-project-bf20a4bb135f#.29b6s6fp5)`,
    room
  )
}

function botResponseGandalf({ room }) {
  chatHelpers.send(
    `[![](http://emojis.slackmojis.com/emojis/images/1450458362/181/gandalf.gif)](http://giphy.com/gifs/B3hcUhLX3BFHa/tile)`,
    room
  )
}

function botResponseHug({ room }) {
  chatHelpers.send(`⊂(´・ω・｀⊂)`, room)
}

function botResponseShrug({ room }) {
  chatHelpers.send(String.raw`¯\\\_(ツ)_/¯`, room)
}

function botResponseHello({ room, data: { fromUser: { displayName: name } } }) {
  chatHelpers.send(`oh hi there ${name}`, room)
  respondWithGif('hi', room)
}

function botResponseHelp({ room }) {
  chatHelpers.send(
    `> #Odin-Bot Commands
    > - give points to someone who has been helpful by mentioning their name and adding ++ : \`@username ++\` or by giving them a star : \`@username :star:\`
    > - view the points leaderboard with \`/leaderboard\`
    > - To view or join the rest of the Odin chatrooms click [HERE](https://gitter.im/orgs/TheOdinProject/rooms).
    > - share a nice gif with your friends with \`/giphy\` and another word
    > - For help with gitter commands (and \`code\` syntax)press \`ctl+shift+alt+m\`
    > - Type \`/help\` to view this message again
    > - motivate your fellow odinites with \`/motivate\` and mention them
    > - I'm open source!  Hack me [HERE](https://github.com/codyloyd/odin-bot-js)!`,
    room
  )
}

function botResponseCode({ room }) {
  chatHelpers.send(
    `> #Writing Code in Chat
    > To write multiple lines of code in chat, use three [backticks](https://i.stack.imgur.com/ETTnT.jpg) like so:
    > \\\`\\\`\\\`
    > [Put your Code here!]
    > \\\`\\\`\\\`
    > For a small inline portion of code, just use one backtick like so:
    >\\\`Code here!\\\``,
    room
  )
}

function botResponsePartyParrot({ room, text }) {
  var parrots = [
    'http://cultofthepartyparrot.com/parrots/parrotdad.gif',
    'http://cultofthepartyparrot.com/parrots/parrot.gif',
    'http://cultofthepartyparrot.com/parrots/shuffleparrot.gif',
    'http://cultofthepartyparrot.com/parrots/parrotcop.gif',
    'http://cultofthepartyparrot.com/parrots/fiestaparrot.gif',
    'http://cultofthepartyparrot.com/parrots/explodyparrot.gif',
    'http://cultofthepartyparrot.com/parrots/aussieparrot.gif',
    'http://cultofthepartyparrot.com/parrots/slomoparrot.gif',
    'http://cultofthepartyparrot.com/parrots/stableparrot.gif',
    'http://cultofthepartyparrot.com/parrots/twinsparrot.gif',
    'http://cultofthepartyparrot.com/parrots/hd/dealwithitparrot.gif',
    'http://cultofthepartyparrot.com/parrots/tripletsparrot.gif'
    // 'http://emojis.slackmojis.com/emojis/images/1450738632/246/leftshark.png',
    // 'http://emojis.slackmojis.com/emojis/images/1472757675/1132/otter-dance.gif'
  ]

  if (text.toLowerCase().match('   p')) {
    var parrotUrl = 'http://cultofthepartyparrot.com/parrots/congaparrot.gif'
    chatHelpers.send(
      `![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})![](${parrotUrl})`,
      room
    )
  } else if (text.toLowerCase().match('!')) {
    chatHelpers.send(`![](${parrots[0]})`, room)
  } else {
    var index = helpers.randomInt(parrots.length)
    chatHelpers.send(`![]( ${parrots[index]} )`, room)
  }
}

// function botResponseWindows({ room }) {
//   if (parseInt(Math.random() * 10) == 0) {
//     chatHelpers.send('![](http://i.imgur.com/q9s5OKr.gif)', room)
//     chatHelpers.send('##did I hear someone say something about WINDOWS?', room)
//   }
// }

function botResponseDontGiveUp({
  text,
  room,
  data: { fromUser: { username: user } }
}) {
  var mentions = helpers.getMentions(text)

  if (mentions) mentions = mentions.join(' ')
  else mentions = `@${user}` // if no one is mentioned, tag the requester

  chatHelpers.send(
    `${mentions} Don't give up! https://www.youtube.com/watch?v=KxGRhd_iWuE`,
    room
  )
}

function botResponseChuck({ room }) {
  var joke = chuck();
  chatHelpers.send(joke, room)
}

function botResponseWeatherInCity({text, room}) {
  const units = {
    'C': 'metric',
    'F': 'imperial',
  }

  const query = text.split(" ")
  let city = text.match(/(?!\/weather.?) [a-zA-Z ]*/)[0]
  let unit = query[0][query[0].length-1].toLowerCase()
  if(unit == 'c') {
    unit = 'C'
  } else if(unit == 'f') {
    unit = 'F'
  } else {
    unit = 'K'
  }
  console.log(city, unit)
  chatHelpers.send(`checking weather in ${city}`, room)

  request(
    `http://api.openweathermap.org/data/2.5/weather?APPID=${weatherKey}&q=${city}&units=${units[unit]}`,
    function(error, response, body) {
      console.log('error:', error)
      console.log('statusCode:', response && response.statusCode)
      if(body) {
        const weatherResponse = JSON.parse(body)
        if (weatherResponse.cod === '404') {
          chatHelpers.send(`${weatherResponse.message}.... how about this instead?`, room)
          botResponseWeatherInCity({text: "/weather Intercourse PA", room})
          return
        }
        const iconCode = weatherResponse.weather[0].icon || "50d"
        const description = weatherResponse.weather[0].description
        const temp = weatherResponse.main.temp
        const high = weatherResponse.main.temp_max
        const low = weatherResponse.main.temp_min
        const city = weatherResponse["name"]
        const message = `${description} in ${city} today, with temp of ${temp}${unit}. High: ${high}. Low: ${low}. \n ![](http://openweathermap.org/img/w/${iconCode}.png)`
        chatHelpers.send(message, room)
      }
    }
  )
}

function botResponseSpoopy({room}) {
  chatHelpers.send('https://media.giphy.com/media/EHKRUd3NpbHFe/giphy.gif', room)
}

exports.botResponseSpoopy = botResponseSpoopy
exports.botResponseUseLinux = botResponseUseLinux
exports.botResponseGandalf = botResponseGandalf
exports.botResponseHug = botResponseHug
exports.botResponseHello = botResponseHello
exports.botResponseHelp = botResponseHelp
exports.botResponsePartyParrot = botResponsePartyParrot
exports.botResponseWeatherInCity = botResponseWeatherInCity
// exports.botResponseWindows = botResponseWindows
exports.botResponseDontGiveUp = botResponseDontGiveUp
exports.botResponseCode = botResponseCode
exports.botResponseChuck = botResponseChuck
exports.botResponseShrug = botResponseShrug
// exports.botResponseChat = botResponseChat
