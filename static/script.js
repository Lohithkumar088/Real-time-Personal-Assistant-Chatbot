const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

const userAvatar = "static/images/user-avatar.png"; // Ensure this file exists
const botAvatar = "static/images/chatbot-avatar.png"; // Ensure this file exists

function typeWriterEffect(element, text, speed = 50) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}


function addMessage(role, content) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container', role === 'user' ? 'user-container' : 'bot-container');

  // Avatar
  const avatarImg = document.createElement('img');
  avatarImg.src = role === 'user' ? userAvatar : botAvatar;
  avatarImg.classList.add('message-avatar');

  // Message Bubble
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  if (role === 'bot') {
    typeWriterEffect(messageDiv, content);
  } else {
    messageDiv.textContent = content;
  }

  if (role === 'user') {
    messageContainer.appendChild(messageDiv);
    messageContainer.appendChild(avatarImg);
  } else {
    messageContainer.appendChild(avatarImg);
    messageContainer.appendChild(messageDiv);
  }

  chatHistory.appendChild(messageContainer);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}


async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessage('user', userMessage);
  userInput.value = '';

  typingIndicator.style.display = 'flex';

  try {
    const response = await fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userMessage }),
    });

    if (!response.ok) throw new Error('Failed to fetch response from the server.');

    const data = await response.json();
    const botMessage = data.result;

    typingIndicator.style.display = 'none';
    addMessage('bot', botMessage); 
  } catch (error) {
    console.error('Error:', error);
    typingIndicator.style.display = 'none';
    addMessage('bot', 'Sorry, something went wrong. Please try again.');
  }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
