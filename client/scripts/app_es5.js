const API_URL = 'https://api.parse.com/1/classes/messages';
let app = {};
let currentResults, currentRoom;
let currentUser = window.location.search.slice(10);

app.send = function(message) {
  message = JSON.stringify(message);
  $.ajax({
    type: 'POST',
    url: API_URL,
    success: function() { console.log('message sent'); },
    data: message,
    error: function(e) { console.error(e); }
  });
};

app.fetch = function() {
  currentUser = window.location.search.slice(10);
  $.ajax({
    type: 'GET',
    url: API_URL,
    data: {order: '-createdAt'},
    success: app.processResults,
    error: function(e) { console.error(e); }
  });
};

app.clearMessages = function() {
  let messages = $('#chats');
  messages.empty();
  console.log('cleared!');
};

app.renderMessage = function(message, roomname = '#chats') {
  let newMessage = $(`<div class='message panel panel-default'>
      <div class='panel-heading'>
        <div class='user-name'><a href='#' class='user-name ${message.username}'>${message.username}</a></div>
      </div>
      <div class='panel-body'>
        <span class='text'>${message.text}</span>
      </div>
    </div>`);
  $(`.${roomname}`).prepend(newMessage);
  window.init();
};

app.renderRoom = function(event) {
  currentRoom = event.target.id;
  app.updateRoomName(currentRoom);
  app.clearMessages();
  let newRoom = $(`<div class='chatroom ${event.target.id}'></div>`);
  $('#chats').prepend(newRoom);
  for (let i = 0; i < currentResults.results.length; i++) {
    let room = currentResults.results[i].roomname;
    if (room === event.target.id) {
      app.renderMessage(currentResults.results[i], event.target.id);
    }
  }
  window.init();
};

app.handleUsernameClick = function(event) {
  event.preventDefault();
  let userID = event.target.classList[1];
  $(`.${userID}`).css('font-weight', 'bold');
};

app.handleSubmit = function(event) {
  // Make sure user has joined a room before submitting
  if (!currentRoom) {
    return alert('Please join a room before submitting!');
  }
  // Make sure user input not blank
  if (!$('.text-field').val()) {
    return alert('Please type a message before submitting!');
  }
  let newSubmit = {};
  newSubmit.roomname = currentRoom;
  newSubmit.text = $('.text-field').val();
  newSubmit.username = currentUser;
  // Send message for submitting
  console.log(newSubmit);
  app.send(newSubmit);
  console.log('rendering message locally!');
  app.renderMessage(newSubmit, currentRoom);

};

app.processResults = function(data) {
  // Update the current response
  currentResults = data;
  // Clear Previous Data
  app.clearMessages();

  console.log('Data Recieved:\n', data);
  // Populate Channel Dropdown
  let channelList = {};
  for (let i = 0; i < data.results.length; i++) {
    if (data.results[i].roomname) {
      // Check for duplicate channel data
      if (!channelList.hasOwnProperty(data.results[i].roomname)) {
        channelList[data.results[i].roomname] = 1;
        let $dropDownItem = $('<li></li>');
        $dropDownItem.appendTo($('.dropdown-menu'));
        let $channelName = $('<a href="#"></a>');
        $channelName.appendTo($dropDownItem);
        // app.renderMessage(data.results[i]);
        $channelName.text(data.results[i].roomname);
        $channelName.attr('id', data.results[i].roomname);
        $($dropDownItem).append($channelName);
      } else {
        console.log('Duplicate channel, skipping!');
      }

    }
  }
};

app.updateRoomName = function(room) {
  $('.currentroom').text(`Current Room: ${room}`).removeClass('hidden');
  console.log('Joined Room: ', room);
};

app.fetch();
