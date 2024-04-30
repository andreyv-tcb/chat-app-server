const http = require('http');
const socketio = require('socket.io');

const server = http.createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const CONNECTED_USERS = {};

io.on('connection', (socket) => {

    socket.on('user_connected', (data) => {
        if (!CONNECTED_USERS[socket.id]) {
            CONNECTED_USERS[socket.id] = data;
        }
        io.emit('user_connected', { id: socket.id, ...data });
        console.log(CONNECTED_USERS)
    });

    socket.on("message", (data) => {
        io.emit('message', { ...data, id: socket.id });
    })

    socket.on("disconnect", () => {
        io.emit('user_disconnected', { id: CONNECTED_USERS[socket.id], ...CONNECTED_USERS[socket.id] });
        if (CONNECTED_USERS[socket.id]) {
            delete CONNECTED_USERS[socket.id];
        }
    })
});

server.listen(3000, () => {
    console.log('Socket.io server listening on port 3000');
});