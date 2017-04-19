'use strict'

const botFunctions = require('../botResponses/botFunctions.js')

function listenToMessages(gitter, roomId) {
  gitter.rooms.find(roomId).then(function(room) {
    const events = room.streaming().chatMessages()
    events.on('chatMessages', function(message) {
      /* 
      make sure the message is a 'create' message 
      and that it's not "from" the bot
      can't have him calling himself!
      */
      if (
        message.operation === 'create' &&
        message.model.fromUser.username !== 'odin-bot'
      ) {
        const messageData = {
          data: message.model,
          text: message.model.text,
          room: room
        }
        Object.values(botFunctions).forEach(({condition, response}) => {
          if (messageData.text.toLowerCase().match(condition))
            response(messageData)
        })
      }
    })
  })
}

function send(message, room) {
  room.send(message)
}

exports.listenToMessages = listenToMessages
exports.send = send
