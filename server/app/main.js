'use strict';

var express = require('express'),
    log = require('debug')('app:main'),
    app = express();

app.use(express.static('server/public'));

var server = app.listen(9001, function() {
    var host = server.address().host,
        port = server.address().port;

    log("services app listening at http://" + host + ":" + port);
});