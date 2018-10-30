import { CONFIG } from '../config';
// @ts-ignore
import * as QRcode from 'qrcode-svg';

export class Room {

  private readonly address: string;

  constructor (id: number) {
    this.address = `http://${CONFIG.MOBILE_APP.HOST}:${CONFIG.MOBILE_APP.PORT}?roomId=${id}`;
  }

  setQRcode (element: HTMLElement) {
    const svg = new QRcode({
      content: this.address,
      background: 'transparent',
      color: '#fff',
    }).svg();
    (element as HTMLImageElement).innerHTML = svg;
  }

  setLink (element: HTMLElement) {
    element.innerHTML = this.address;
  }
}
