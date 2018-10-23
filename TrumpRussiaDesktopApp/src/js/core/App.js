import io from 'socket.io-client';
import { CONFIG } from '../config';
import { Room } from './Room';
import { Pages } from '../utils/Pages';
import { Game } from './Game';
import { DatGui } from '../utils/DatGui';

export class App {

    constructor () {
        this.socket = io(`http://${CONFIG.SERVER.HOST}:${CONFIG.SERVER.PORT}`);
    }

    init () {
        Pages.show('linker');
        this.initRoom();
        this.initGame();
        this.socket.on('experience:start', this.start.bind(this));
    }

    initRoom () {
        this.socket.emit('room:create', id => {
            const room = new Room(id);
            room.setQRcode(document.getElementById('qrcode'));
            room.setLink(document.getElementById('address'));
        });
    }

    initGame () {
        if (CONFIG.DEBUG_MODE) DatGui.init();
        this.game = new Game(this.socket, window.innerWidth, window.innerHeight);
        this.game.init();

        const container = document.getElementById('experience');
        container.appendChild(this.game.renderer.domElement);

        window.addEventListener('resize', () => {
            this.game.resize(window.innerWidth, window.innerHeight)
        });
    }

    start () {
        Pages.show('experience');
        this.game.animate();
    }

}