'use strict';

var express = require('express'),
    log = require('debug')('app:main'),
    app = express();

app.use(express.static('public'));

var server = app.listen(9001, function() {
    var host = server.address().host,
        port = server.address().port;

    log("services app listening at http://" + host + ":" + port);
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');
      socket.on('disconnect', function(){
            console.log('user disconnected');
              });
});
