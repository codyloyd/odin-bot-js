var request = require("request");

request("http://api.icndb.com/jokes/random", function(error, response, body) {
    const json = JSON.parse(body)
    var value = json["value"]
    var joke = value["joke"]
    return joke
});