var responses = require('./botResponses.js')
const { botResponseGiphy } = require('./giphy')
const { botResponseLeaderboard, botResponsePoints } = require('./points')

var botFunctions = {
  giphy: {
    condition: /\/giphy/,
    response: botResponseGiphy
  },
  pointsbot: {
    condition: /@[a-zA-Z0-9-_]+\s?\+\+\s?/,
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
  }
  // chatWithBot: {
  //   condition: /bot\b|hello|hi/,
  //   response: responses.botResponseChat
  // }
}

module.exports = botFunctions
