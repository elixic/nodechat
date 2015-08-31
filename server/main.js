'use strict';

var express = require('express'),
    cookieparser = require('cookie-parser'),
    bodyparser = require('body-parser'),
    log = require('debug')('app:main'),
    mem = require('memory-cache'),
    userUtil = require('./users'),
    app = express(),
    server, io;

app.use(cookieparser("asdf1234-elixic-klank-ritethis"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'jade');

server = app.listen(9001, function() {
    var host = server.address().host,
        port = server.address().port,
        users = [];

    mem.put('users', users);

    log("services app listening at http://" + host + ":" + port);
});

app.get('/', function(req, res) {
    if(!req.cookies.username) {
        res.render('login');
    } else {
        res.render('chat');
        userUtil.add(mem, req.cookies.username);
    }
});

app.post('/login', function(req, res) {
    log(req);
    if (req.body.username) {
        res.cookie('username', req.body.username);
        res.redirect('chat');
    } else {
        res.send(403);
    }
});

io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('a user connected');

    console.log(mem.get('users'));

    var cookie=socket.handshake.headers['cookie'];

    // cookie looks like "io=CgejXGM81UsPl3UMAAAA; username=klank"

//    var real_cookies = cookieparser.JSONCookie(cookie);
    var real_cookies = cookieparser.signedCookie(cookie,"asdf1234-elixic-klank-ritethis");

    console.log(real_cookies); // normally ends up just being the starting string
    console.log(real_cookies.username)

    io.emit('updateUsers', mem.get('users'));

    socket.on('globalMessage', function(message) {
        log(message);
        io.emit('globalMessage', message);
    });

    socket.on('disconnect', function(){
            console.log('user disconnected');
              });
});
