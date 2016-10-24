function mod(n, m) {
        return ((n % m) + m) % m;
}

var caesar = function (string,key) {
  if (key == "X") {
    return inspectString(string)
  }
  var array = string.split("")
  var translatedArray = array.map(function(char){
    var charCode = char.charCodeAt()
    if (charCode >= 65 && charCode <= 90) {
      return String.fromCharCode(mod((charCode + key - 65 ), 26) + 65)
    } else if (charCode >= 97 && charCode <= 122) {
      return String.fromCharCode(mod((charCode + key - 97), 26) + 97)
    } else {
      return char
    }
  })

  return translatedArray.join("")
}

var inspectString = function(string){
  var arrayOfWords = string.split(" ")
  var translation = false
  arrayOfWords.forEach(function (word) {
    for (var i = 1; i < 26; i++) {
      if (words.indexOf(caesar(word.toLowerCase(),i)) > 0) {
        translation = caesar(string,(i))
      }
    }
  })
  return translation
}

module.exports = caesar

var words = [
'the',
'be',
'to',
'of',
'and',
'in',
'that',
'have',
'it',
'for',
'not',
'on',
'with',
'he',
'you',
'do',
'at',
'this',
'but',
'his',
'by',
'from',
'they',
'we',
'say',
'her',
'she',
'or',
'an',
'will',
'my',
'one',
'all',
'would',
'there',
'their',
'what',
'so',
'up',
'out',
'if',
'about',
'who',
'get',
'which',
'go',
'me',
'when',
'make',
'can',
'like',
'time',
'no',
'just',
'him',
'know',
'take',
'person',
'into',
'year',
'your',
'good',
'some',
'could',
'them',
'see',
'other',
'than',
'then',
'now',
'look',
'only',
'come',
'its',
'over',
'think',
'also',
'back',
'after',
'use',
'two',
'how',
'our',
'work',
'first',
'well',
'way',
'even',
'new',
'want',
'because',
'any',
'these',
'give',
'day',
'most',
'us',
'hello',
'world'
]