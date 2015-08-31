'use strict';

var express = require('express'),
    Session = require('express-session'),
    bodyparser = require('body-parser'),
    log = require('debug')('app:main'),
    mem = require('memory-cache'),
    userUtil = require('./users'),
    app = express(),
    server, io, ios,
    secret = "asdf1234-elixic-klank-ritethis",
    session = Session({
      secret: secret,
      resave: false,
      saveUninitialized: true
    });

// seupt the session stuff
app.use(session);
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
    if(!req.session.username) {
        res.render('login');
    } else {
        res.render('chat');
        userUtil.add(mem, req.session.username);
    }
});

app.post('/login', function(req, res) {
    log(req);
    if (req.body.username) {
        req.session.username = req.body.username;
        res.redirect('chat');
    } else {
        res.send(403);
    }
});

io = require('socket.io')(server);
ios = require('socket.io-express-session');
io.use(ios(session));
io.on('connection', function(socket){
    console.log('a user connected');
    console.log(mem.get('users'));
    console.log(socket.handshake.session.username);

    io.emit('updateUsers', mem.get('users'));

    socket.on('globalMessage', function(message) {
        log(message);
        io.emit('globalMessage', message);
    });

    socket.on('disconnect', function(){
            console.log('user disconnected');
    });
});
