import * as io from 'socket.io-client';
import { CONFIG } from '../config';

class Socket {
  private readonly socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(`https://${CONFIG.SERVER.HOST}`);
  }

  getInstance() {
    return this.socket;
  }
}

export const SOCKET = new Socket();
