var config = {

  // gitter settings for retrieving and sending messages
  gitter: {
    // gitter token, can be retrieved from https://developer.gitter.im/apps
    token: 'a0db2d4e6004bb4aeaadb0381148bc9a4aba8aed',


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
   apikey: 'dc6zaTOxFJmzC',

   // regex to match the giphy command (could be anything)
   regex: /^\/giphy/

  },

  pointsbot: {
    token: '51b3ba1beec78d389dc21af70db66491',
    regex: /@\S+\s?\+\+/
  }

}

module.exports = config;
