const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const rooms = require('./modules/rooms');

io.on('connection', socket => {

  /**
   * Rooms
   */

  socket.on('room:create', callback => {
    const id = rooms.create();
    socket.join(id);
    socket.roomId = id;
    console.log('create', id);
    callback(id);
  });

  socket.on('room:join', id => {
    socket.join(id);
    socket.roomId = id;
    console.log('join', id);
    io.to(id).emit('game:start');
  });

  /**
   * Game
   */

  socket.on('game:win', () => {
    io.to(socket.roomId).emit('game:win');
  });

  socket.on('game:lose', () => {
    io.to(socket.roomId).emit('game:lose');
  });

  /**
   * Cameras
   */

  socket.on('camera:set', id => {
    io.to(socket.roomId).emit('camera:set', id);
  });

  socket.on('camera:orientation', data => {
    io.to(socket.roomId).emit('camera:orientation', data)
  });

  socket.on('camera:zoom', data => {
    io.to(socket.roomId).emit('camera:zoom', data)
  });

  /**
   * Timer
   */

  socket.on('timer:change', data => {
    io.to(socket.roomId).emit('timer:change', data)
  });

  socket.on('timer:end', data => {
    io.to(socket.roomId).emit('game:lose');
  });

  /**
   * Pause
   */

  socket.on('pause:on', data => {
    io.to(socket.roomId).emit('pause:on', data)
  });

  socket.on('pause:off', data => {
    io.to(socket.roomId).emit('pause:off', data)
  });

  /**
   * Enveloppe
   */

  socket.on('envelope:hover', envelope => {
    io.to(socket.roomId).emit('envelope:hover', envelope);
  });

  socket.on('envelope:dragged', envelope => {
    io.to(socket.roomId).emit('envelope:dragged', envelope);
  });

  /**
   * Pages
   */

  socket.on('page:show', name => {
    console.log(name, socket.roomId);
    io.to(socket.roomId).emit('page:show', name);
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
