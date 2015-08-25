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

socket.on('updateUsers', function(users){
  console.log("updateUsers: " + users);

  // clear out the users
  $('#user-list').html("");

  // update the list to include the users
  var arrayLength = users.length;
  for (var i = 0; i < arrayLength; i++) {
    $('#user-list').append("<li>" + users[i] + "</li>");
  }
});

function PlayOneShot(soundObj) {
    var sound = document.getElementById(soundObj);
    sound.Play();
}
