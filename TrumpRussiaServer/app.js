const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const rooms = require('./modules/rooms');

io.on('connection', socket => {
  console.log("Client connected");

  socket.on('room:create', callback => {
    const id = rooms.create();
    socket.join(id);
    socket.roomId = id;
    callback(id);
  });

  socket.on('room:join', id => {
    socket.join(id);
    socket.roomId = id;
    io.to(id).emit('game:start');
  });

  socket.on('game:win', () => {
    io.to(socket.roomId).emit('game:win');
  });

  socket.on('game:lose', () => {
    io.to(socket.roomId).emit('game:lose');
  });

  socket.on('camera:set', id => {
    io.to(socket.roomId).emit('camera:set', id);
  });

  socket.on('camera:orientation', data => {
    io.to(socket.roomId).emit('camera:orientation', data)
  });

  socket.on('camera:zoom', data => {
    io.to(socket.roomId).emit('camera:zoom', data)
  });

  socket.on('timer:change', data => {
    io.to(socket.roomId).emit('timer:change', data)
  });

  socket.on('timer:end', data => {
    //io.to(socket.roomId).emit('timer:end', data);
    io.to(socket.roomId).emit('game:lose');
  });

  socket.on('pause:on', data => {
    io.to(socket.roomId).emit('pause:on', data)
  });

  socket.on('pause:off', data => {
    io.to(socket.roomId).emit('pause:off', data)
  });

  socket.on('envelope:hover', envelope => {
    io.to(socket.roomId).emit('envelope:hover', envelope);
  });

  socket.on('envelope:dragged', envelope => {
    io.to(socket.roomId).emit('envelope:dragged', envelope);
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
