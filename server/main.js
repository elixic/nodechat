'use strict';

var express = require('express'),
    cookies = require('cookie-parser'),
    bodyparser = require('body-parser'),
    log = require('debug')('app:main'),
    app = express(),
    server, io;

app.use(cookies("asdf1234-elixic-klank-ritethis"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'jade');

server = app.listen(9001, function() {
    var host = server.address().host,
        port = server.address().port;

    log("services app listening at http://" + host + ":" + port);
});

app.get('/', function(req, res) {
    if(!req.cookies.username) {
        res.render('login');
    } else {
        res.render('chat');
    }
});

app.post('/login', function(req, res) {
    log(req);
    if (req.body.username) {
        res.cookie('username', req.body.username);
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
