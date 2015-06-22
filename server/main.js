'use strict';

var express = require('express'),
    cookies = require('cookie-parser'),
    log = require('debug')('app:main'),
    app = express(),
    server, io;

app.use(cookies("asdf1234-elixic-klank-ritethis"));
app.use(express.static('public'));

server = app.listen(9001, function() {
    var host = server.address().host,
        port = server.address().port;

    log("services app listening at http://" + host + ":" + port);
});

app.get('/', function(req, res) {
    if(!req.cookies.username) {
        res.redirect('/login.html');
    } else {
        res.redirect('/chat.html');
    }
});

app.get('/login', function(req, res) {
    if (req.username) {
        res.cookie('username', req.username);
        res.redirect('/chat.html');
    } else {
        res.send(403);
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
