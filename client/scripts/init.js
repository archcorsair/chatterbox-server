$(document).ready(function() {
  // Chatterbox Initialization
  window.init = function init() {
    // Remove existing handlers
    $('#chats .username').off('click', app.handleUsernameClick);
    $('#send .submit').off('click', app.handleSubmit);
    $('#send .clear-btn').off('click', app.clearMessages);
    $('.dropdown-menu').off('click', app.renderRoom);
    // Add new handlers
    $('#chats .user-name').on('click', app.handleUsernameClick);
    $('#send .submit').on('click', app.handleSubmit);
    $('#send .clear-btn').on('click', app.clearMessages);
    $('.dropdown-menu').on('click', app.renderRoom);
  };
  init();
});
