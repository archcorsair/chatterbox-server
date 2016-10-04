class App {
  constructor() {
    this.currentResults;
    this.currentRoom;
    this.currentUser = window.location.search.slice(10);
    this.API_URL = 'https://api.parse.com/1/classes/messages';
    this.chats = $('#chats');
    this.textField = $('.text-field');
    this.myBody = $('body');
    this.dropDownMenu = $('.dropdown-menu');
    this.channelList = {};
    this.init();
  }

  init() {
    let _this = this;
    // Remove existing handlers
    console.log('Initialization');
    // this.myBody.off('click', '#chats .username', this.handleUsernameClick);
    // this.myBody.off('click', '#send .submit', this.handleSubmit);
    // this.myBody.off('click', '#send .clear-btn', this.clearMessages);
    // this.myBody.off('click', '.dropdown-menu', this.renderRoom);
    // Add new handlers
    this.myBody.on('click', '#chats .username', (e) => _this.handleUsernameClick(e));
    this.myBody.on('click', '#send .submit', (e) => _this.handleSubmit(e));
    this.myBody.on('click', '#send .clear-btn', (e) => _this.clearMessages(e));
    this.myBody.on('click', '.dropdown-menu', (e) => _this.renderRoom(e));
    this.fetch();
  }

  send(message) {
    message = JSON.stringify(message);

    $.ajax({
      type: 'POST',
      url: this.API_URL,
      data: message,
      // dataType: 'text',
      success: function() { console.log('message sent'); },
      error: function(e) { console.error(e); }
    });
  }

  fetch() {
    this.currentUser = window.location.search.slice(10);
    let _this = this;
    $.ajax({
      type: 'GET',
      url: this.API_URL,
      data: {order: '-createdAt'},
      success: (data) => _this.renderRoomList(data),
      error: function(e) { console.error(e); }
    });
  }

  clearMessages() {
    this.chats.empty();
    console.log('Messages Cleared');
  }

  renderMessage(message, roomname = '#chats') {
    let newMessage = $(`<div class='message panel panel-default'>
        <div class='panel-heading'>
          <div class='user-name'><a href='#' class='user-name ${message.username}'>${message.username}</a></div>
        </div>
        <div class='panel-body'>
          <span class='text'>${message.text}</span>
        </div>
      </div>`);
    $(`.${roomname}`).prepend(newMessage);

    // this.init();

  }

  renderRoom(event) {
    console.log('rendering room list');
    this.currentRoom = event.target.id;
    this.updateRoomName(this.currentRoom);
    this.clearMessages();

    let newRoom = $(`<div class='chatroom ${event.target.id}'></div>`);
    this.chats.prepend(newRoom);

    for (let i = 0; i < this.currentResults.results.length; i++) {
      let room = this.currentResults.results[i].roomname;
      if (room === event.target.id) {
        this.renderMessage(this.currentResults.results[i], event.target.id);
      }
    }
    // this.init();

  }

  handleUsernameClick(event) {
    event.preventDefault();
    let userID = event.target.classList[1];
    $(`.${userID}`).css('font-weight', 'bold');
  }

  handleSubmit(event) {
    if (!this.currentRoom) { // Make sure user has joined a room before submitting
      return alert('Please join a room before submitting!');
    }
    if (!this.textField.val()) { // Make sure user input not blank
      return alert('Please type a message before submitting!');
    }
    let newSubmit = {};
    newSubmit.roomname = this.currentRoom;
    newSubmit.text = this.textField.val();
    newSubmit.username = this.currentUser;
    // Done creating new message object, send it off
    this.send(newSubmit);
    this.renderMessage(newSubmit, this.currentRoom);
  }

  renderRoomList(data) {
    this.currentResults = data; // Save a local copy of server data
    this.clearMessages();

    console.log('Data Recieved:\n', data);

    for (let i = 0; i < data.results.length; i++) {
      if (data.results[i].roomname) {
        // Check for duplicate channel data
        if (!this.channelList.hasOwnProperty(data.results[i].roomname)) {
          this.channelList[data.results[i].roomname] = 1;
          let $dropDownListItem = $('<li></li>');
          $dropDownListItem.appendTo(this.dropDownMenu);
          let $channelName = $('<a href="#"></a>');
          $channelName.appendTo($dropDownListItem);
          $channelName.text(data.results[i].roomname);
          $channelName.attr('id', data.results[i].roomname);
          $($dropDownListItem).append($channelName);
        } else {
          console.log('Duplicate channel found, skipping!');
        }
      }
    }
  }

  updateRoomName(roomName) {

    $('.currentroom').text(`Current Room: ${roomName}`).removeClass('hidden');
    console.log('Joined Room: ', roomName);
  }
}

let Chatterbox = new App();
