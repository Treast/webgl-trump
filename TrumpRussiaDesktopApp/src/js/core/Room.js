import {CONFIG} from '../config';
import * as QRCode from 'qrcode';

export class Room {

    constructor (id) {
        this.address = `http://${CONFIG.MOBILE_APP.HOST}:${CONFIG.MOBILE_APP.PORT}?roomId=${id}`;
    }

    setQRcode (element) {
        QRCode.toCanvas(element, this.address);
    }

    setLink (element) {
        element.innerHTML = this.address
    }
}