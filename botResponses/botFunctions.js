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
  shurg: {
    condition: /\/shurg/,
    response: responses.botResponseShurg,
  },
  smart: {
    condition: /\/smart/,
    response: responses.botResponseSmart,
  },    
  flip: {
    condition: /\/flip/,
    response: responses.botResponseFlip,
  },    
  justasecond: {
    condition: /^\/jas\b|^\/holdon\b/igm,
    response: responses.botResponseHoldOn
  },
  notNice: {
    condition: /@[a-zA-Z0-9-_]+\s?(\-\-)/,
    response: responses.botResponseNotNice
  },
  lmgtfy: {
    condition: /^\/google.*/,
    response: responses.botResponseLMGTFY
  }
}

module.exports = botFunctions
