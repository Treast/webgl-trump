import * as io from 'socket.io-client';
import { CONFIG } from '../config';
import { Room } from './Room';
import { PAGES } from '../utils/Pages';
import { Game } from './Game';
import { DAT_GUI } from '../utils/DatGui';

export class App {

  private readonly socket: SocketIOClient.Socket;
  private game: Game;

  constructor () {
    this.socket = io(`http://${CONFIG.SERVER.HOST}:${CONFIG.SERVER.PORT}`);
  }

  init () {
    PAGES.show('linker');
    this.initRoom();
    this.initGame();
    this.socket.on('experience:start', this.start.bind(this));
  }

  initRoom () {
    this.socket.emit('room:create', (id: number) => {
      const room = new Room(id);
      room.setQRcode(document.getElementById('qrcode'));
      room.setLink(document.getElementById('address'));
    });
  }

  initGame () {
    if (CONFIG.DEBUG_MODE) DAT_GUI.init();
    this.game = new Game(this.socket, window.innerWidth, window.innerHeight);
    this.game.init();

    const container = document.getElementById('experience');
    container.appendChild(this.game.renderer.domElement);

    window.addEventListener('resize', () => {
      this.game.resize(window.innerWidth, window.innerHeight);
    });
  }

  start () {
    PAGES.show('experience');
    this.game.animate();
  }

}
