'use strict'

var config = require('./config.js')

var Gitter = require('node-gitter')
var gitter = new Gitter(config.gitter.token)

var chatHelpers = require('./helpers/chatHelpers.js')

// gitter room name from config gets joined, to receive the room id on start
var rooms = config.gitter.rooms

// join all the rooms
rooms.forEach(room => {
  gitter.rooms
    .join(room)
    .then(room => {
      console.log(`Joined room: ${room.name}`)
      chatHelpers.listenToMessages(gitter, room.id)
    })
    .fail(err => {
      console.log(`There was an error: ${err}`)
    })
})
