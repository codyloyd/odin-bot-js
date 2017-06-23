const config = require('../config.js')
const Giphy = require('giphy')
const giphy = new Giphy(config.giphy.apikey)
const {randomInt} = require('../helpers/helpers.js')
const chatHelpers = require('../helpers/chatHelpers.js')

function chooseRandomGif(searchTerm) {
  return new Promise(function(resolve, reject) {
    giphy.translate({s: searchTerm}, function(
      err,
      result
    ) {
      if (err) reject('error')
      if (result.data) {
        const imageUrl = result.data.images.original.url
        const url = result.data.url
        resolve({url, imageUrl})
      } else {
        reject('no gif')
      }
    })
  })
}

function respondWithGif(searchTerm, room) {
  const gifs = ['hi', 'love', 'pizza', 'kiss']
  chooseRandomGif(gifs[helpers.randomInt(gifs.length)])
    .then(function(image) {
      var feedContent = `[![](${image.imageUrl})](${image.url})`
      chatHelpers.send(feedContent, room)
    })
    .catch(function() {
      chatHelpers.send('there was an error', room)
    })
}

function botResponseGiphy({data, text, room}) {
  const GIPHY = '/giphy'
  const searchTermRegex = new RegExp(GIPHY + '\\s+(.*)')
  const mentionRegex = /@([a-zA-Z0-9-_]+)/
  let user = data.fromUser.username
  // replace underscores and colons to spaces because emojis

  if (!text.match(searchTermRegex)) {
    return chatHelpers.send(
      'use the giphy command with a keyword like so: `/giphy TACOS`',
      room
    )
  }
  let searchTerm = text.match(searchTermRegex)[1].replace(/_|:/g, ' ').trim()

  console.log(`${searchTerm}`)
  if (mentionRegex.test(text)) {
    user = text.match(mentionRegex)[1]
    searchTerm = searchTerm.replace(mentionRegex, '')
  }

  if (searchTerm) {
    chooseRandomGif(searchTerm)
      .then(image => {
        const feedContent = `@${user} __${searchTerm}__ \n\n [![${searchTerm}](${image.imageUrl})](${image.url})`
        chatHelpers.send(feedContent, room)
      })
      .catch(function() {
        chooseRandomGif('FAIL')
          .then(image => {
            chatHelpers.send(
              `__no gif was found with that keyword!__ \n\n !["FAIL"](${image.imageUrl})`,
              room
            )
          })
          .catch(function() {
            chatHelpers.send('there was an error', room)
          })
      })
  } else {
    // otherwise send an explanation to user
    var help =
      '@' +
      user +
      ': use `/giphy` with a word, to get a gif related to that word, eg. `/giphy cats hats`'
    chatHelpers.send(help, room)
  }
}

module.exports = {botResponseGiphy, chooseRandomGif}
