$.getJSON("http://api.icndb.com/jokes/random", function(json) {
	var value = json["value"]
	var joke = value["joke"]
	return joke;
});