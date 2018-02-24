'use strict'

var request = require('request')
var config = require('../config.js')

function requestUser(username, callback, errorcallback) {
  request(
    {
      url: 'https://api.gitter.im/v1/user?q=' + username,
      headers: {Authorization: 'Bearer ' + config.gitter.token}
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var user = JSON.parse(body).results[0]
        if (user && user.username.toLowerCase() == username.toLowerCase())
          callback(user)
        else errorcallback()
      }
    }
  )
}

function getMentions(message) {
  return message.match(/@\S+/g)
}

function randomInt(range) {
  return parseInt(Math.random() * range)
}

//record time of event
function getTime() {
  return new Date().getTime()
}

function elapsedTime(time) {
  return (getTime() - time) / 1000
}

function pointsPluralizer(points) {
  return points === 1 ? 'point' : 'points'
}

function exclamation(points) {
  if (points < 5) {
    return 'Nice!'
  } else if (points < 25) {
    return 'Sweet!'
  } else if (points < 99) {
    return 'Woot!'
  } else if (points < 105) {
    return 'HOLY CRAP!!'
  } else if (points > 199 && points < 206) {
    return 'DAM SON:'
  } else if (points > 299 && points < 306) {
    return 'OK YOU CAN STOP NOW:'
  } else {
    return 'Woot!'
  }
}

function getNamesFromText(text) {
  var regex = /@([a-zA-Z0-9-_]+)\s?(\+\+|:star:)/g, matches = [], match
  while ((match = regex.exec(text)) !== null)
    matches.push(match[1])
  return matches
}

function textToQuery(text) {
  var query = text.split(" ");
  var url = "http://lmgtfy.com/?q=";
  
  query.forEach(function(element){
    if (element == query[0]) { url += element}
    else {url += "+" + element}
  });
  return url;
}
exports.getNamesFromText = getNamesFromText
exports.requestUser = requestUser
exports.getMentions = getMentions
exports.randomInt = randomInt
exports.elapsedTime = elapsedTime
exports.pointsPluralizer = pointsPluralizer
exports.exclamation = exclamation
exports.textToQuery = textToQuery
