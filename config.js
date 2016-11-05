var config = {

  // gitter settings for retrieving and sending messages
  gitter: {
    // gitter token, can be retrieved from https://developer.gitter.im/apps
    token: process.env.GITTER_TOKEN,


    // room: {
    //   // name of the gitter room, you want to retrieve and send the messages
    //   name: 'TheOdinProject/bot-spam-playground'
    // },

    rooms: [
      "bot-spam-playground",
      "Code-Review",
      "Computer-Science",
      "Contributing",
      "ContributingActivtity",
      "Getting-Hired",
      "Git",
      "HTML-CSS",
      "Interesting-Stuff",
      "Javascript",
      "ModTeam",
      "Rails",
      "Random",
      "Ruby",
      "theodinproject",
      "secretbotroom"
    ],

    // custom webhook to send the gifs to the activity feed
    webhook: 'https://webhooks.gitter.im/e/ca75b94537a0fb91d19f',

    // place, where gif should be sent
    // possibilities: activity, chat
    // if "chat" the message will be send from the user from whom the token is
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
    regex: /@\S+\s?\+\+/
  }

}

module.exports = config;
