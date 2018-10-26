import { CONFIG } from '../config';
import { Room } from './Room';
import { PAGES } from '../utils/Pages';
import { Game } from './Game';
import { DAT_GUI } from '../utils/DatGui';
import { SOCKET } from './Socket';

export class App {

  private game: Game;

  init () {
    PAGES.show('linker');
    this.initRoom();
    this.initGame();
    SOCKET.getInstance().on('experience:start', this.start.bind(this));
  }

  initRoom () {
    SOCKET.getInstance().emit('room:create', (id: number) => {
      const room = new Room(id);
      room.setQRcode(document.getElementById('qrcode'));
      room.setLink(document.getElementById('address'));
    });
  }

  initGame () {
    if (CONFIG.DEBUG_MODE) DAT_GUI.init();
    this.game = new Game(window.innerWidth, window.innerHeight);
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
