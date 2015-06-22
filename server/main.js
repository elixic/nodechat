'use strict';

var express = require('express'),
    log = require('debug')('app:main'),
    app = express(),
    server, io;

app.use(express.static('public'));

server = app.listen(9001, function() {
    var host = server.address().host,
        port = server.address().port;

    log("services app listening at http://" + host + ":" + port);
});

app.get('/', function(req, res) {
        res.cookie('connected', 1);

    if(!req.cookie.connected) {
        res.redirect('/login.html');
    } else {
        res.reirect('/chat.html');
    }
});

io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('globalMessage', function(message) {
        log(message);
        io.emit('globalMessage', message);
    });

    socket.on('disconnect', function(){
            console.log('user disconnected');
              });
});
