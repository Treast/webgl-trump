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

  socket.on('game:win', (data) => {
    socket.to(socket.roomId).emit('game:win', data);
  });

  socket.on('game:lose', (data) => {
    socket.to(socket.roomId).emit('game:lose', data);
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

  socket.on('sound:toggle', data => {
    socket.to(socket.roomId).emit('sound:toggle', data);
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

  socket.on('envelope:delete', envelope => {
    socket.to(socket.roomId).emit('envelope:delete', envelope);
  });

  socket.on('helper:run', envelope => {
    socket.to(socket.roomId).emit('helper:run', envelope);
  });

  socket.on('helper:stop', envelope => {
    socket.to(socket.roomId).emit('helper:stop', envelope);
  });

  socket.on('end:morale', envelope => {
    socket.to(socket.roomId).emit('end:morale', envelope);
  });

  /**
   * 7.Pages
   */

  socket.on('call:end', data => {
    socket.to(socket.roomId).emit('call:end', data);
  });

  socket.on('page:show', name => {
    socket.broadcast.to(socket.roomId).emit('page:show', name);
  });

  socket.on('page:fade', name => {
    socket.broadcast.to(socket.roomId).emit('page:fade', name);
  });

  socket.on('restart', () => {
    socket.to(socket.roomId).emit('restart');
  })

  socket.on('disconnect', () => {
    socket.to(socket.roomId).emit('client:disconnect');
  })

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
