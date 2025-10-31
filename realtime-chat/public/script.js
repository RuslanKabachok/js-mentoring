const socket = new WebSocket('wss://localhost:9000');
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const usersListDiv = document.getElementById('usersList');
const usersCountSpan = document.getElementById('usersCount');

const username = prompt('Введіть ваше ім\'я:') || 'Анонім';

function updateUsersList(users) {
    usersCountSpan.textContent = `(${users.length})`;

    usersListDiv.innerHTML = '';

    if (users.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'user-item';
        emptyMsg.textContent = 'Немає онлайн користувачів';
        emptyMsg.style.color = '#95a5a6';
        usersListDiv.appendChild(emptyMsg);
        return;
    }

    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        userElement.textContent = user === username ? `${user} (Ви)` : user;

        if (user === username) {
            userElement.classList.add('own');
        }

        usersListDiv.appendChild(userElement);
    });
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function addMessageToChat(data) {
    const msg = document.createElement('div');

    if (data.type === 'system') {
        msg.className = 'message system';
        msg.textContent = data.text;
    } else if (data.type === 'message') {
        const time = formatTime(data.timestamp);

        msg.className = data.username === username ? 'message own' : 'message other';

        const messageHeader = document.createElement('div');
        messageHeader.className = 'message-header';
        messageHeader.textContent = data.username === username ? 'Ви' : data.username;

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = time;
        messageTime.style.fontSize = '0.7em';
        messageTime.style.opacity = '0.7';
        messageTime.style.marginTop = '5px';

        const messageText = document.createElement('div');
        messageText.textContent = data.text;

        msg.appendChild(messageHeader);
        msg.appendChild(messageText);
        msg.appendChild(messageTime);
    }

    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

socket.onopen = () => {
    socket.send(JSON.stringify({
        type: 'join',
        username: username
    }));
    sendBtn.disabled = false;
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'users_online') {
        updateUsersList(data.users);
        return;
    }

    addMessageToChat(data);
};

sendBtn.onclick = sendMessage;

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const messageText = input.value.trim();
    if (messageText && socket.readyState === WebSocket.OPEN) {
        const message = {
            type: 'message',
            username: username,
            text: messageText
        };

        socket.send(JSON.stringify(message));
        input.value = '';
    }
}

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    sendBtn.disabled = true;
};

socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
    sendBtn.disabled = true;

    if (!event.wasClean) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'message system';
        errorMsg.textContent = '⚠️ Втрачено зʼєднання з сервером. Спробуйте оновити сторінку.';
        errorMsg.style.color = '#dc3545';
        messagesDiv.appendChild(errorMsg);
    }
};

sendBtn.disabled = true;