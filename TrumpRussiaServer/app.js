const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const rooms = require('./modules/rooms');

/*
*
* 1.Rooms
* 2.Game
* 3.Cameras
* 4.Timer
* 5.Pause
* 6.Envelopes
* 7.Pages
*
* */

io.on('connection', socket => {

  /**
   * 1.Rooms
   */

  socket.on('room:create', callback => {
    const id = rooms.create();
    socket.join(id);
    socket.roomId = id;
    callback(id);
  });

  socket.on('room:join', id => {
    socket.join(id);
    socket.roomId = id;
    socket.to(id).emit('game:start');
  });

  /**
   * 2.Game
   */

  socket.on('game:count', () => {
    socket.to(socket.roomId).emit('game:count');
  });

  socket.on('game:win', () => {
    socket.to(socket.roomId).emit('game:win');
  });

  socket.on('game:lose', () => {
    socket.to(socket.roomId).emit('game:lose');
  });

  /**
   * 3.Cameras
   */

  socket.on('camera:set', id => {
    socket.to(socket.roomId).emit('camera:set', id);
  });

  socket.on('camera:orientation', data => {
    socket.to(socket.roomId).emit('camera:orientation', data)
  });

  socket.on('camera:zoom', data => {
    socket.to(socket.roomId).emit('camera:zoom', data)
  });

  /**
   * 4.Timer
   */

  socket.on('timer:change', data => {
    socket.to(socket.roomId).emit('timer:change', data)
  });

  socket.on('timer:end', data => {
    socket.to(socket.roomId).emit('game:lose');
  });

  socket.on('counter:change', count => {
    socket.to(socket.roomId).emit('counter:change', count);
  });

  /**
   * 5.Pause
   */

  socket.on('pause:on', data => {
    socket.broadcast.to(socket.roomId).emit('pause:on', data)
  });

  socket.on('pause:off', data => {
    socket.broadcast.to(socket.roomId).emit('pause:off', data)
  });

  /**
   * 6.Enveloppe
   */

  socket.on('envelope:hover', envelope => {
    socket.to(socket.roomId).emit('envelope:hover', envelope);
  });

  socket.on('envelope:pickup', envelope => {
    socket.to(socket.roomId).emit('envelope:pickup', envelope);
  });

  /**
   * 7.Pages
   */

  socket.on('page:show', name => {
    console.log(name, socket.id);
    socket.to(socket.roomId).emit('page:show', name);
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
