/**
 * La classe Room va générer l'URL selon la configuration du fichier .env et également le QRCode.
 */

import { CONFIG } from '../config';
// @ts-ignore
import * as QRcode from 'qrcode-svg';

export class Room {

  private readonly address: string;

  constructor (id: number) {
    this.address = `${CONFIG.MOBILE_APP}?roomId=${id}`;
  }

  /**
   * On génère le QRCode et on l'affiche.
   * @param element
   */
  setQRcode (element: HTMLElement) {
    const svg = new QRcode({
      content: this.address,
      background: 'transparent',
      color: '#fff',
    }).svg();
    (element as HTMLImageElement).innerHTML = svg;
  }

  /**
   * On affiche le lien mobile (si jamais).
   * @param element
   */
  setLink (element: HTMLElement) {
    element.innerHTML = this.address;
  }
}
