import effectManager from '../../core/EffectManager';
import { GUI } from 'dat.gui';
import { GUIParamsInterface } from './GUIParamsInterface';

export class GUIParamsBadTVPass implements GUIParamsInterface {

  public enable: boolean = true;

  private readonly distortion: any;
  private readonly distortion2: any;
  private readonly speed: any;
  private readonly rollSpeed: any;

  constructor () {
    this.distortion = 3.0;
    this.distortion2 = 1.0;
    this.speed = 0.3;
    this.rollSpeed = 0.1;
  }


  init(gui: GUI): void {
    gui.add(this, 'distortion', 0.1, 20).step(0.1).listen().name('Thick Distort');
    gui.add(this, 'distortion2', 0.1, 20).step(0.1).listen().name('Fine Distort');
    gui.add(this, 'speed', 0.0,1.0).step(0.01).listen().name('Distort Speed');
    gui.add(this, 'rollSpeed', 0.0,1.0).step(0.01).listen().name('Roll Speed');
  }

  render(): void {
    effectManager.getBadTVPass().uniforms['distortion'].value = this.distortion;
    effectManager.getBadTVPass().uniforms['distortion2'].value = this.distortion2;
    effectManager.getBadTVPass().uniforms['speed'].value = this.speed;
    effectManager.getBadTVPass().uniforms['rollSpeed'].value = this.rollSpeed;
  }

}