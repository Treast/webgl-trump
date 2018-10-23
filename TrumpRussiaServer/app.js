const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const rooms = require('./modules/rooms');

io.on('connection', socket => {

    socket.on('room:create', callback => {
        const id = rooms.create();
        socket.join(id);
        socket.roomId = id;
        callback(id);
    });

    socket.on('room:join', id => {
        socket.join(id);
        socket.roomId = id;
        io.to(id).emit('experience:start');
    });

    socket.on('mobile:orientation', data => {
    io.to(socket.roomId).emit('mobile:orientation', data)
    });

    socket.on('timer:end', data => {
    io.to(socket.roomId).emit('timer:end', data)
    });

    socket.on('camera:set', id => {
       io.to(socket.roomId).emit('camera:set', id);
    });

});

http.listen(3000, () => {
    console.log('listening on *:3000');
});