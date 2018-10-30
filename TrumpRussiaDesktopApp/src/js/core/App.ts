import { CONFIG } from '../config';
import { Room } from './Room';
import { PAGES } from '../utils/Pages';
import { Game } from './Game';
import { DAT_GUI } from '../utils/DatGui';
import { SOCKET } from './Socket';

export class App {

  init () {
    PAGES.show('introduction');
    // PAGES.show('linker');
    this.initRoom();
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
    Game.getInstance().init(window.innerWidth, window.innerHeight);

    const container = document.getElementById('experience');
    container.appendChild(Game.getInstance().renderer.domElement);

    window.addEventListener('resize', () => {
      Game.getInstance().resize(window.innerWidth, window.innerHeight);
    });
  }

  start () {
    PAGES.show('experience');
    Game.getInstance().animate();
  }

}
