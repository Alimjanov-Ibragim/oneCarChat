class Message {
  constructor(id, text, sender, date, status, quote = null, files = []) {
    this.id = id;
    this.text = text;
    this.sender = sender;
    this.date = date;
    this.status = status;
    this.quote = quote;
    this.files = files;
  }
}

class Chat {
  constructor(chatId, messages = []) {
    this.chatId = chatId;
    this.messages = messages;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  removeMessage(messageId) {
    this.messages = this.messages.filter(message => message.id !== messageId);
  }

  updateMessageStatus(messageId, status) {
    const message = this.messages.find(message => message.id === messageId);
    if (message) {
      message.status = status;
    }
  }
}

class ChatService {
  constructor() {
    this.chats = {};
  }

  getChat(chatId) {
    return this.chats[chatId];
  }

  createChat(chatId) {
    this.chats[chatId] = new Chat(chatId);
  }

  addMessage(chatId, message) {
    const chat = this.getChat(chatId);
    if (chat) {
      chat.addMessage(message);
    }
  }

  removeMessage(chatId, messageId) {
    const chat = this.getChat(chatId);
    if (chat) {
      chat.removeMessage(messageId);
    }
  }

  updateMessageStatus(chatId, messageId, status) {
    const chat = this.getChat(chatId);
    if (chat) {
      chat.updateMessageStatus(messageId, status);
    }
  }
}

class ChatComponent {
  constructor(chatId) {
    this.chatId = chatId;
    this.messages = [];
    this.newMessage = '';
    this.quote = null;
    this.files = [];
    this.searchQuery = '';
    this.notification = false;
    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.link = '';
    this.chatService = new ChatService();
  }

  sendMessage() {
    const message = new Message(
      Date.now(),
      this.newMessage,
      'user',
      new Date(),
      'sent',
      this.quote,
      this.files
    );
    this.chatService.addMessage(this.chatId, message);
    this.newMessage = '';
    this.quote = null;
    this.files = [];
    this.notification = true;
  }

  quoteMessage(message) {
    this.quote = message;
  }

  addFile(file) {
    this.files.push(file);
  }

  removeFile(file) {
    this.files = this.files.filter(f => f !== file);
  }

  search(e) {
    this.searchQuery = e.target.value;
  }

  updateMessageStatus(messageId, status) {
    this.chatService.updateMessageStatus(this.chatId, messageId, status);
  }

  boldText() {
    this.bold = !this.bold;
  }

  italicText() {
    this.italic = !this.italic;
  }

  underlineText() {
    this.underline = !this.underline;
  }

  linkText(e) {
    this.link = e.target.value;
  }

  render() {
    const chatElement = document.getElementById('chat');
    chatElement.innerHTML = '';
    const searchElement = document.createElement('input');
    searchElement.type = 'text';
    searchElement.value = this.searchQuery;
    searchElement.oninput = this.search.bind(this);
    chatElement.appendChild(searchElement);
    const messageListElement = document.createElement('ul');
    this.messages
      .filter(message => message.text.includes(this.searchQuery))
      .forEach(message => {
        const messageElement = document.createElement('li');
        const textElement = document.createElement('p');
        textElement.textContent = message.text;
        messageElement.appendChild(textElement);
        const filesElement = document.createElement('p');
        message.files.forEach(file => {
          const fileElement = document.createElement('a');
          fileElement.href = file;
          fileElement.textContent = file;
          filesElement.appendChild(fileElement);
        });
        messageElement.appendChild(filesElement);
        const statusElement = document.createElement('p');
        statusElement.textContent = `Status: ${message.status}`;
        messageElement.appendChild(statusElement);
        const quoteButtonElement = document.createElement('button');
        quoteButtonElement.onclick = this.quoteMessage.bind(this, message);
        quoteButtonElement.textContent = 'Quote';
        messageElement.appendChild(quoteButtonElement);
        messageListElement.appendChild(messageElement);
      });
    chatElement.appendChild(messageListElement);
    const newMessageElement = document.createElement('input');
    newMessageElement.type = 'text';
    newMessageElement.value = this.newMessage;
    newMessageElement.oninput = e => {
      this.newMessage = e.target.value;
    };
    chatElement.appendChild(newMessageElement);
    const sendButtonElement = document.createElement('button');
    sendButtonElement.onclick = this.sendMessage.bind(this);
    sendButtonElement.textContent = 'Send';
    chatElement.appendChild(sendButtonElement);
    const boldButtonElement = document.createElement('button');
    boldButtonElement.onclick = this.boldText.bind(this);
    boldButtonElement.textContent = 'B';
    chatElement.appendChild(boldButtonElement);
    const italicButtonElement = document.createElement('button');
    italicButtonElement.onclick = this.italicText.bind(this);
    italicButtonElement.textContent = 'I';
    chatElement.appendChild(italicButtonElement);
    const underlineButtonElement = document.createElement('button');
    underlineButtonElement.onclick = this.underlineText.bind(this);
    underlineButtonElement.textContent = 'U';
    chatElement.appendChild(underlineButtonElement);
    const linkElement = document.createElement('input');
    linkElement.type = 'text';
    linkElement.value = this.link;
    linkElement.oninput = this.linkText.bind(this);
    chatElement.appendChild(linkElement);
    if (this.notification) {
      const notificationElement = document.createElement('p');
      notificationElement.textContent = 'New message!';
      chatElement.appendChild(notificationElement);
    }
  }
}

const chatComponent = new ChatComponent('chat');
chatComponent.render();
