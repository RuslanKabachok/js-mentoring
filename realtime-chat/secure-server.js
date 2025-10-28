const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const path = require('path');

const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'ssl-certs', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl-certs', 'cert.pem'))
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.username = null;

    ws.on('message', (message) => {
        const messageString = message.toString();
        console.log('Received:', messageString);

        try {
            const data = JSON.parse(messageString);

            if (data.type === 'join') {
                ws.username = data.username;
                console.log(`${data.username} приєднався`);

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
                const chatMsg = JSON.stringify({
                    type: 'message',
                    username: data.username,
                    text: data.text,
                    timestamp: Date.now()
                });

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
});

const PORT = 9000;
server.listen(PORT, () => {
    console.log(`Secure server running on https://localhost:${PORT}`);
});