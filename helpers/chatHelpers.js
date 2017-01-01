'use strict';

var botFunctions = require('../botFunctions.js');

function listenToMessages(gitter, roomId) {
  gitter.rooms.find(roomId).then(function(room) {
    var events = room.streaming().chatMessages();

    events.on('chatMessages', function(message) {
      // make sure the message is a 'create' message and that it's not "from" the bot
      // can't have him calling himself!
      if (message.operation === 'create' && message.model.fromUser.username !== 'odin-bot') {
        var messageData = {
          data: message.model,
          text: message.model.text,
          room: room
        };

        for (var i in botFunctions) {
          if (messageData.text.toLowerCase().match(botFunctions[i].condition))
            botFunctions[i].response(messageData);
        }
      }

    });
  });
}

function send (message, room) {
  room.send(message);
}

exports.listenToMessages = listenToMessages;
exports.send = send;