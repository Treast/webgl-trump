import effectManager from '../../core/EffectManager';
import { GUI } from 'dat.gui';
import { GUIParamsInterface } from './GUIParamsInterface';

export class GUIParamsFilmPass implements GUIParamsInterface {

  public enable: boolean = true;

  private readonly scanlinesCount: number;
  private readonly grayscale: boolean;
  private readonly scanlinesIntensity: number;
  private readonly noiseIntensity: number;

  constructor () {
    this.scanlinesCount = 256;
    this.grayscale = false;
    this.scanlinesIntensity = 0.3;
    this.noiseIntensity = 0.8;
  }

  init(gui: GUI): void {
    gui.add(this, 'scanlinesIntensity', 0, 1);
    gui.add(this, 'noiseIntensity', 0, 3);
    gui.add(this, 'grayscale');
    gui.add(this, 'scanlinesCount', 0, 2048).step(1);
  }

  render(): void {
    const filmPass = effectManager.getFilmPass();
    filmPass.uniforms.grayscale.value = this.grayscale;
    filmPass.uniforms.nIntensity.value = this.noiseIntensity;
    filmPass.uniforms.sIntensity.value = this.scanlinesIntensity;
    filmPass.uniforms.sCount.value = this.scanlinesCount;
  }
}