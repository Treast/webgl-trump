import { CONFIG } from '../config';
import * as io from 'socket.io-client';

class Socket {
  private readonly socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(`${CONFIG.SERVER}`);
  }

  get() {
    return this.socket;
  }
}

export default new Socket().get();
