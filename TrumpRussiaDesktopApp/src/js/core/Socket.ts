/**
 * Singleton Socket.IO
 */

import * as io from 'socket.io-client';
import { CONFIG } from '../config';

class Socket {
  private readonly socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(`${CONFIG.SERVER}`);
  }

  get() {
    return this.socket;
  }
}
const SOCKET = new Socket();
export default SOCKET.get();
