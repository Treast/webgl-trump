import * as dat from 'dat.gui';
import {CONFIG} from '../config';

class GuiParams {

    public positionX: number;
    public positionY: number;
    public positionZ: number;

    constructor () {
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = 0;
    }
}

export const DatGui = {

    gui: CONFIG.DEBUG_MODE ? new dat.GUI() : null,

    params: new GuiParams(),

    init () {
        this.gui.add(this.params, 'positionX', -500, 500);
        this.gui.add(this.params, 'positionY', -500, 500);
        this.gui.add(this.params, 'positionZ', -500, 500);
    }
};