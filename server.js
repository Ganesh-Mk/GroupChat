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
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    })

    socket.on('disconnect', name => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    })

    
});








server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
