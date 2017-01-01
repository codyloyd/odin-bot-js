'use strict';

var config = require('./config.js');

var Gitter = require('node-gitter');
var gitter = new Gitter(config.gitter.token);

var chatHelpers = require('./helpers/chatHelpers.js');

// gitter room name from config gets joined, to receive the room id on start
var rooms = config.gitter.rooms;

// join all the rooms
for (var i = 0; i < rooms.length; i++) {
  gitter.rooms.join('TheOdinProject/' + rooms[i])
    .then(function(room) {
      console.log(`Joined room: ${room.name}`);
      chatHelpers.listenToMessages(gitter, room.id);
    })
    .fail(function(err) {
      console.log(`There was an error: ${err}`);
    });
}

