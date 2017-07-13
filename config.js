'use strict'

var config = {
  // gitter settings for retrieving and sending messages
  gitter: {
    // gitter token, can be retrieved from https://developer.gitter.im/apps
    token: process.env.GITTER_TOKEN,
    //array of rooms that the bot should be active in
    rooms: [
      'TheOdinProject/bot-spam-playground',
      'TheOdinProject/Code-Review',
      'TheOdinProject/Computer-Science',
      'TheOdinProject/Contributing',
      'TheOdinProject/Getting-Hired',
      'TheOdinProject/Git',
      'TheOdinProject/HTML-CSS',
      'TheOdinProject/Interesting-Stuff',
      'TheOdinProject/Javascript',
      'TheOdinProject/ModTeam',
      'TheOdinProject/Rails',
      'TheOdinProject/Random',
      'TheOdinProject/Ruby',
      'TheOdinProject/theodinproject',
      'TheOdinProject/LookingForPairs',
      'codyloyd',
      // 'TheOdinProject/secretbotroom'
    ],
    place: 'chat'
  },

  giphy: {
    // giphy api key
    apikey: process.env.GIPHY_API_KEY,
    // regex to match the giphy command (could be anything)
    regex: /^\/giphy/
  },

  pointsbot: {
    token: process.env.POINTSBOT_TOKEN,
    regex: /@[A-Za-z0-9_-]\s?(\+\+|:star:)/
  },
  apiai: {
    apikey: process.env.APIAI_TOKEN
  }
}

module.exports = config
