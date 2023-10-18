const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(express.static(__dirname));

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (userName) => {
        users[socket.id] = userName;
        socket.broadcast.emit('user-joined', userName);
        io.emit('update-members', Object.values(users)); // Send the updated member list to all clients
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        const userName = users[socket.id];
        socket.broadcast.emit('leave', userName);
        delete users[socket.id];
        io.emit('update-members', Object.values(users)); // Send the updated member list to all clients
    });

    socket.on('typing', () => {
        socket.broadcast.emit('user-typing', users[socket.id]);
    });

    socket.on('stop-typing', () => {
        socket.broadcast.emit('user-stopped-typing', users[socket.id]);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
