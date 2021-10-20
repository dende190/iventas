const socket = io();
const userId = document.querySelector('.jsUserId').value;
const dMessages = document.querySelector('.messages');

function makeScrollMessages() {
  setTimeout(
    function() {
      document.querySelector('.messages').scroll(0, 1000);
    },
    100
  );
}

makeScrollMessages();

document.querySelector('.jsSendMessage').addEventListener('click', function() {
  const dMessage = document.querySelector('.jsMessage');
  if (!dMessage.value) {
    return;
  }
  socket.emit('message', {
    userId: userId,
    message: dMessage.value,
    date: new Date().getTime(),
  });

  dMessage.value = '';
  makeScrollMessages();
});

socket.on('message', message => {
  let userImage = '.jsMyImage';
  let className = 'my_message';
  let containerMessage = 'container_my_message';
  if (message.userId !== userId) {
    userImage = '.jsContactImage';
    className = 'contact_message';
    containerMessage = '';
  }

  const dMessage = document.querySelector('.message-clone').cloneNode(true);
  dMessage.hidden = false;
  dMessage.classList.remove('message-clone');
  dMessage.classList.add('message', className);
  dMessage.querySelector('.text').textContent = message.message;
  dMessage.querySelector('.user_chat_image').src = (
    document.querySelector(userImage).value
  );
  if (containerMessage) {
    dMessage.querySelector('.container_message').classList.add(
      'container_my_message'
    );
  }

  document.querySelector('.list_messages').appendChild(dMessage);
  makeScrollMessages();
});
