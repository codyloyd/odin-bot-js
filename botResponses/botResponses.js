'use strict'

var request = require('request')
var config = require('../config.js')
var winston = require('winston');
var weatherKey = config.weatherAPI.weatherApiKey
var helpers = require('../helpers/helpers.js')
var chatHelpers = require('../helpers/chatHelpers.js')
var { respondWithGif } = require('./giphy')

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

function botResponseShurg({ room }) {
  chatHelpers.send(String.raw`¯\\\_()_ツ/¯`, room)
}

function botResponseSmart({ room }) {
  chatHelpers.send(String.raw`f(ಠ‿↼)z`, room)
}

function botResponseFlip({ room }) {
  chatHelpers.send(String.raw`(╯°□°）╯︵ ┻━━━━┻ `, room)
}

function botResponseHello({ room, data: { fromUser: { displayName: name } } }) {
  chatHelpers.send(`oh hi there ${name}`, room)
  respondWithGif('hi', room)
}

function botResponseHelp({ room }) {
  chatHelpers.send(
    `> #Odin-Bot Commands
    > - **By posting in this chatroom you agree to our [code of conduct](https://github.com/TheOdinProject/theodinproject/blob/master/doc/code_of_conduct.md)**
    > - give points to someone who has been helpful by mentioning their name and adding ++ : \`@username ++\` or by giving them a star : \`@username :star:\`
    > - view the points leaderboard with \`/leaderboard\`
    > - To view or join the rest of the Odin chatrooms click [HERE](https://gitter.im/orgs/TheOdinProject/rooms).
    > - share a nice gif with your friends with \`/giphy\` and another word
    > - For help with gitter commands (and \`code\` syntax) press \`ctl+shift+alt+m\`
    > - Type \`/help\` to view this message again
    > - motivate your fellow odinites with \`/motivate\` and mention them
    > - I'm open source!  Hack me [HERE](https://github.com/codyloyd/odin-bot-js)!`,
    room
  )
}

function botResponseCode({ room }) {
  chatHelpers.send(
    `> #Composing Code Snippets
    > To write multiple lines of code use three [backticks](https://i.stack.imgur.com/ETTnT.jpg) (on their own line):
    > \\\`\\\`\\\`
    > [Put your Code here!]
    > \\\`\\\`\\\`
    > For \`inline code\` use one backtick:
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
    'http://cultofthepartyparrot.com/parrots/tripletsparrot.gif',
    'http://emojis.slackmojis.com/emojis/images/1450738632/246/leftshark.png',
    'http://emojis.slackmojis.com/emojis/images/1472757675/1132/otter-dance.gif'
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

function botResponseJustDoIt({
  text,
  room,
  data: { fromUser: { username: user } }
}) {
  var mentions = helpers.getMentions(text)

  if (mentions) mentions = mentions.join(' ')
  else mentions = `@${user}` //if no one is mentioend, tag the requester

  chatHelpers.send(
    `${mentions} What are you waiting for?! https://www.youtube.com/watch?v=ZXsQAXx_ao0`,
    room
  )
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

function botResponseHoldOn({ room }) {
  chatHelpers.send(
    `![](https://media.giphy.com/media/l1J9zVWOtZHcDfZ5u/giphy.gif)`, room
  )
}

function botResponseNotNice ({ room }) {
  chatHelpers.send(
    '![Not Nice](http://media.riffsy.com/images/636a97aa416ad674eb2b72d4a6e9ad6c/tenor.gif)', room
  )
}

function botResponseLMGTFY ({text, room }) {
  const query = text.match(/(?!\/google.?) .*/)[0].trim()
  chatHelpers.send(`[Here's your result!](
    ${helpers.textToQuery(query)})`, room
  )
}

exports.botResponseGandalf = botResponseGandalf
exports.botResponseHug = botResponseHug
exports.botResponseHello = botResponseHello
exports.botResponseHelp = botResponseHelp
exports.botResponsePartyParrot = botResponsePartyParrot
exports.botResponseWeatherInCity = botResponseWeatherInCity
exports.botResponseDontGiveUp = botResponseDontGiveUp
exports.botResponseJustDoIt = botResponseJustDoIt
exports.botResponseCode = botResponseCode
exports.botResponseShrug = botResponseShrug
exports.botResponseShurg = botResponseShurg
exports.botResponseSmart = botResponseSmart
exports.botResponseFlip = botResponseFlip
exports.botResponseHoldOn = botResponseHoldOn
exports.botResponseNotNice = botResponseNotNice
exports.botResponseLMGTFY = botResponseLMGTFY
