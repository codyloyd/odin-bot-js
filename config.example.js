var config = {

  // gitter settings for retrieving and sending messages
  gitter: {
    // gitter token, can be retrieved from https://developer.gitter.im/apps
    token: '122496bd738d5708a217116f65a12a3eb086ca1a',


    room: {
      // name of the gitter room, you want to retrieve and send the messages
      name: 'TheOdinProject/bot-spam-playground'
    },
    
    // custom webhook to send the gifs to the activity feed
    webhook: 'https://webhooks.gitter.im/e/57da9ae340f3a6eec065648a',
    
    // place, where gif should be sent
    // possibilities: activity, chat
    // if "chat" the message will be send from the user from whom the token is
    place: 'activity'

  },
  
  giphy: {
   
   // giphy api key
   apikey: 'dc6zaTOxFJmzC',
   
   // regex to match the giphy command (could be anything)
   regex: /^\/giphy/
    
  }
  
}

module.exports = config;
