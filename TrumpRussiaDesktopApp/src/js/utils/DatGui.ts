import * as dat from 'dat.gui';
import { CONFIG } from '../config';

class GuiParams {

  public positionX: number;
  public positionY: number;
  public positionZ: number;
  public rotateX: number;
  public rotateY: number;
  public rotateZ: number;

  constructor () {
    this.positionX = 0;
    this.positionY = 0;
    this.positionZ = 0;
    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateZ = 0;
  }
}

export const DAT_GUI = {

  gui: CONFIG.DEBUG_MODE ? new dat.GUI() : null,

  params: new GuiParams(),

  init () {
    this.gui.add(this.params, 'positionX', -20, 20);
    this.gui.add(this.params, 'positionY', -20, 20);
    this.gui.add(this.params, 'positionZ', -20, 20);
    this.gui.add(this.params, 'rotateX', -180, 180);
    this.gui.add(this.params, 'rotateY', -180, 180);
    this.gui.add(this.params, 'rotateZ', -180, 180);
  },
};
