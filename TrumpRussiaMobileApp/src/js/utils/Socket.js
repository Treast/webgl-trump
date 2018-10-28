import { CONFIG } from "../config";
import io from 'socket.io-client';

let instance = null;

export class Socket {

  constructor() {
    if (instance === null) {
      this.socket = io(`http://${CONFIG.SERVER.HOST}:${CONFIG.SERVER.PORT}`);
      instance = this;
    }
    return instance;
  }

  static getInstance() {
    return new Socket().socket;
  }

}