import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/shaders/FXAAShader';
import 'three/examples/js/shaders/FilmShader';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/OutlinePass';
import 'three/examples/js/postprocessing/FilmPass';
import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';
import { GUI } from 'dat.gui';
import { GUIParamsInterface } from '../utils/DatGui';

class EffectManager {

  private scene: Scene;
  private renderer: WebGLRenderer;
  private outlinePass: THREE.OutlinePass;
  private filmPass: THREE.FilmPass;
  private composer: THREE.EffectComposer;
  private camera: PerspectiveCamera;
  private height: number;
  private width: number;

  getOutlinePass () {
    return this.outlinePass;
  }

  getFilmPass () {
    return this.filmPass;
  }

  getComposer () {
    return this.composer;
  }

  init () {
    // @ts-ignore
    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    this.initOutlinePass();
    this.initFilmPass();
  }

  initStatus (
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    width: number,
    height: number,
  ) {
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.width = width;
    this.height = height;
    // @ts-ignore
    this.composer = new THREE.EffectComposer(this.renderer);
  }

  initOutlinePass () {
    // @ts-ignore
    this.outlinePass = new THREE.OutlinePass(
      new Vector2(this.width, this.height),
      this.scene,
      this.camera,
    );
    this.outlinePass.edgeStrength = 1;
    this.outlinePass.edgeGlow = 1;
    this.outlinePass.edgeThickness = 1;
    this.outlinePass.pulsePeriod = 2;
    this.outlinePass.usePatternTexture = false;
    this.outlinePass.visibleEdgeColor.set('#ffffff');
    this.outlinePass.hiddenEdgeColor.set('#ffffff');
    this.composer.addPass(this.outlinePass);
  }

  initFilmPass () {
    // @ts-ignore
    this.filmPass = new THREE.FilmPass(0.58, 0.13, 890, false);
    // @ts-ignore
    this.filmPass.renderToScreen = true;
    this.composer.addPass(this.filmPass);
  }
}

const effectManager = new EffectManager();

export default effectManager;

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
