const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const path = require('path');

const onlineUsers = new Map();

function broadcastOnlineUsers() {
    const usersList = Array.from(onlineUsers.values()).map(user => user.username);

    const message = JSON.stringify({
        type: 'users_online',
        users: usersList
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });

    console.log('Online users:', usersList);
}

function sanitizeInput(text) {
    if (typeof text !== 'string') return '';

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'ssl-certs', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl-certs', 'cert.pem'))
}, (req, res) => {
    const filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
})

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('New client connected');
    ws.username = null;

    ws.id = Date.now() + Math.random().toString(36).substr(2, 9);

    ws.on('message', message => {
        const messageString = message.toString();
        console.log('Received:', messageString);
        if (messageString.length > 500) {
            ws.send(JSON.stringify({ error: 'Message too long' }));
            return;
        }

        if (messageString.trim() === '') {
            return;
        }

        try {
            const data = JSON.parse(messageString);

            if (data.type === 'join') {
                ws.username = sanitizeInput(data.username);
                console.log(`${data.username} приєднався`);

                onlineUsers.set(ws.id, {
                    id: ws.id,
                    username: ws.username,
                    ws: ws
                });

                broadcastOnlineUsers();

                const joinMsg = JSON.stringify({
                    type: 'system',
                    text: `${data.username} приєднався до чату`
                });

                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(joinMsg);
                    }
                });
            }

            if (data.type === 'message') {
                const sanitizedText = sanitizeInput(data.text);
                const sanitizedUsername = sanitizeInput(data.username);

                const chatMsg = JSON.stringify({
                    type: 'message',
                    username: sanitizedUsername,
                    text: sanitizedText,
                    timestamp: Date.now()
                });

                console.log('Sending:', chatMsg);

                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(chatMsg);
                    }
                });
            }

        } catch (err) {
            console.error('Invalid JSON:', err);
        }
    });

    ws.on('close', () => {
        if (onlineUsers.has(ws.id)) {
            onlineUsers.delete(ws.id);
            broadcastOnlineUsers();
        }

        if (ws.username) {
            console.log(`${ws.username} відключився`);

            const leaveMsg = JSON.stringify({
                type: 'system',
                text: `${ws.username} покинув чат`
            });

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(leaveMsg);
                }
            });
        }
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        if (onlineUsers.has(ws.id)) {
            onlineUsers.delete(ws.id);
            broadcastOnlineUsers();
        }
    });
});



const PORT = 9000;
server.listen(PORT, () => console.log(`Server running on https://localhost:${PORT}`));
