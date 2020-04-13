const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log(`${socket.id} user connected`);

    socket.on('chat message', (msg) => {
        console.log(`${socket.username} message: ${msg}`);
        socket.broadcast.emit('chat message', msg);
    });

    socket.on('user typing', () => {
        socket.broadcast.emit('user typing', socket.username || socket.id);
    });

    socket.on('user typed', (msg) => {
        socket.broadcast.emit('user typed', socket.username || socket.id);
    });

    socket.on('username', (msg) => {
        socket.username = msg;
        socket.broadcast.emit('user connect', socket.username || socket.id);
    });


    socket.on('disconnect', () => {
        console.log(` ${socket.id} user disconnected`);
        socket.broadcast.emit('user disconnect', socket.username || socket.id);
    });
});



http.listen(3000, function() {
    console.log('Server is listening on port: 3000');
});