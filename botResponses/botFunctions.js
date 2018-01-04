var responses = require('./botResponses.js')
const { botResponseGiphy } = require('./giphy')
const { botResponseLeaderboard, botResponsePoints } = require('./points')

var botFunctions = {
  giphy: {
    condition: /\/giphy/,
    response: botResponseGiphy
  },
  pointsbot: {
    condition: /@[a-zA-Z0-9-_]+\s?(\+\+|:star:)/,
    response: botResponsePoints
  },
  leaderboard: {
    condition: /^\/leaderboard/,
    response: botResponseLeaderboard
  },
  help: {
    condition: /^\/help/,
    response: responses.botResponseHelp
  },
  partyparrot: {
    condition: /partyparrot|party_parrot|party parrot|oiseau/,
    response: responses.botResponsePartyParrot
  },
  /*windows: {
    condition: /windows/,
    response: responses.botResponseWindows
  },*/
  hello: {
    condition: /hello odin-bot|hello bot|hi odin-bot|hi bot/,
    response: responses.botResponseHello
  },
  gandalf: {
    condition: /\/gandalf/,
    response: responses.botResponseGandalf
  },
  hug: {
    condition: /\/hug/,
    response: responses.botResponseHug
  },
  uselinux: {
    condition: /\/windows/,
    response: responses.botResponseUseLinux
  },
  motivate: {
    condition: /\/motivate/,
    response: responses.botResponseDontGiveUp
  },
  justdoit: {
    condition: /\/justdoit/,
    response: responses.botResponseJustDoIt
  },
  weather: {
    condition: /\/weather.? [a-zA-Z]+/,
    response: responses.botResponseWeatherInCity
  },
  code: {
    condition: /^\/code\b/,
    response: responses.botResponseCode
  },
  shrug: {
    condition: /\/shrug/,
    response: responses.botResponseShrug,
  },
  spoopy: {
    condition: /spoopy/,
    response: responses.botResponseSpoopy,
  },
  // chatWithBot: {
  //   condition: /bot\b|hello|hi/,
  //   response: responses.botResponseChat
  // }
  chuck: {
    condition: /\/chuck norris/,
    response: responses.botResponseChuck
  },
  justasecond: {
    condition: /^\/jas\b|^\/holdon\b/igm,
    response: responses.botResponseHoldOn
  },
  whatsnew: {
    condition: /whats new/,
    response: responses.botResponseWhatsNew
  }
}

module.exports = botFunctions
