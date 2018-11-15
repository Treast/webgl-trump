/**
 * Effet visuel lorsque le timer est dépassé (effet TV cassée).
 */

import effectManager from '../../core/EffectManager';
import { GUI } from 'dat.gui';
import { GUIParamsInterface } from './GUIParamsInterface';
import Game from '../../core/Game';
import Flag from '../../core/Flag';

export class GUIParamsFlag implements GUIParamsInterface {

  public enable: boolean = true;

  private readonly offsetX: any;
  private readonly offsetY: any;
  private readonly offsetZ: any;

  private readonly rotationX: any;
  private readonly rotationY: any;
  private readonly rotationZ: any;

  constructor () {
    this.offsetX = Flag.OFFSETX;
    this.offsetY = Flag.OFFSETY;
    this.offsetZ = Flag.OFFSETZ;
    this.rotationX = 0.0;
    this.rotationY = 0.0;
    this.rotationZ = 0.0;
  }

  /**
   * On ajoute les paramètres.
   * @param gui
   */
  init(gui: GUI): void {
    gui.add(this, 'offsetX', -200, 200).step(0.1).listen().name('OffsetX');
    gui.add(this, 'offsetY', -200, 200).step(0.1).listen().name('OffsetY');
    gui.add(this, 'offsetZ', -200, 200).step(0.01).listen().name('OffsetZ');
    gui.add(this, 'rotationX', 0, 2 * Math.PI).step(0.01).listen().name('RotationX');
    gui.add(this, 'rotationY', 0, 2 * Math.PI).step(0.01).listen().name('RotationY');
    gui.add(this, 'rotationZ', 0, 2 * Math.PI).step(0.01).listen().name('RotationZ');
  }

  /**
   * Render
   */
  render(): void {
    Game.flags[0].mesh.position.set(this.offsetX, this.offsetY, this.offsetZ);
  }

}
