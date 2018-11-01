import { CONFIG } from '../config';
import * as io from 'socket.io-client';

let instance: any = null;

export class Socket {
  private socket: SocketIOClient.Socket;

  constructor() {
    if (instance === null) {
      this.socket = io(`${CONFIG.SERVER}`);
      instance = this;
    }
    return instance;
  }

  static getInstance() {
    return new Socket().socket;
  }

}
