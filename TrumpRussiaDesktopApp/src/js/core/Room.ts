import { CONFIG } from '../config';
import * as QRCode from 'qrcode';

export class Room {

  private readonly address: string;

  constructor (id: number) {
    this.address = `http://${CONFIG.MOBILE_APP.HOST}:${CONFIG.MOBILE_APP.PORT}?roomId=${id}`;
  }

  setQRcode (element: HTMLElement) {
    QRCode.toCanvas(element, this.address, (err) => {
      if (err) console.log(err);
    });
  }

  setLink (element: HTMLElement) {
    element.innerHTML = this.address;
  }
}
