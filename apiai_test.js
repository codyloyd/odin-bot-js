var apiai = require('apiai');
 
var app = apiai("d2aae69fe82341889b175a299397d9e3");
 
var request = app.textRequest('how are you?', {
    sessionId: '1'
});
 
request.on('response', function(response) {
    console.log(response.result.fulfillment.speech);
});
 
request.on('error', function(error) {
    console.log(error);
});
 
request.end();