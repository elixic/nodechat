'use strict';

var socket = io();

// chat send
$('form').submit(function(){
    socket.emit('globalMessage', $('#m').val());
    $('#m').val('');
    return false;
});

// globalMessage handler
socket.on('globalMessage', function(msg){
    // add message to chat list
    $('#messages').append($('<li class="list-group-item">').text(msg));

    // ensure we're scrolled to the end so you can see the new content
    var objDiv = document.getElementById("chatDiv");
    objDiv.scrollTop = objDiv.scrollHeight;
    PlayOneShot("ding");
});

function PlayOneShot(soundObj) {
    var sound = document.getElementById(soundObj);
    sound.Play();
}