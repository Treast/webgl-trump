/**
 * EffectManager gère les différents effets visuels sur l'écran.
 */

import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/shaders/FXAAShader';
import 'three/examples/js/shaders/FilmShader';
import './../libs/BadTVShader';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/OutlinePass';
import 'three/examples/js/postprocessing/FilmPass';
import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';

class EffectManager {

  private scene: Scene;
  private renderer: WebGLRenderer;
  // @ts-ignore
  private outlinePass: THREE.OutlinePass;
  // @ts-ignore
  private filmPass: THREE.FilmPass;
  // @ts-ignore
  private composer: THREE.EffectComposer;
  private camera: PerspectiveCamera;
  private height: number;
  private width: number;
  // @ts-ignore
  private badTVPass: THREE.ShaderPass;
  private copyPass: any;
  private enableBadTVPass: boolean = false;

  /**
   * On retourne le OutlinePass.
   */
  getOutlinePass () {
    return this.outlinePass;
  }

  /**
   * On retourne le FilmPass.
   */
  getFilmPass () {
    return this.filmPass;
  }

  /**
   * On retourne le composer.
   */
  getComposer () {
    return this.composer;
  }

  /**
   * On retourne le BadTVPass.
   */
  getBadTVPass () {
    return this.badTVPass;
  }

  /**
   * On retourne l'EnableBadTVPass.
   */
  getEnableBadTVPass () {
    return this.enableBadTVPass;
  }

  /**
   * Initialisation
   */
  init () {
    // @ts-ignore
    this.composer = new THREE.EffectComposer(this.renderer);
    // @ts-ignore
    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    this.initOutlinePass();
    if (this.enableBadTVPass) this.initBadTVPass();
    this.initFilmPass();
    // @ts-ignore
    this.copyPass = new THREE.ShaderPass(THREE.CopyShader);
    this.copyPass.renderToScreen = true;
    this.composer.addPass(this.copyPass);
  }

  /**
   * On récupère la scène.
   * @param scene
   * @param camera
   * @param renderer
   * @param width
   * @param height
   */
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
  }

  /**
   * On définit l'OutlinePass.
   */
  initOutlinePass () {
    // @ts-ignore
    this.outlinePass = new THREE.OutlinePass(
      new Vector2(this.width, this.height),
      this.scene,
      this.camera,
    );
    this.outlinePass.edgeStrength = 4;
    this.outlinePass.edgeGlow = 1;
    this.outlinePass.edgeThickness = 4;
    this.outlinePass.pulsePeriod = 2;
    this.outlinePass.usePatternTexture = false;
    this.outlinePass.visibleEdgeColor.set('#ffffff');
    this.outlinePass.hiddenEdgeColor.set('#ffffff');
    this.composer.addPass(this.outlinePass);
  }

  /**
   * On définit le FilmPass.
   */
  initFilmPass () {
    // @ts-ignore
    this.filmPass = new THREE.FilmPass(0.58, 0.13, 890, true);
    this.composer.addPass(this.filmPass);
  }

  /**
   * On définit le BadTVPass.
   */
  initBadTVPass () {
    // @ts-ignore
    this.badTVPass = new THREE.ShaderPass(THREE.BadTVShader);
    this.badTVPass.uniforms['distortion'].value = 8.3;
    this.badTVPass.uniforms['distortion2'].value = 7;
    this.badTVPass.uniforms['speed'].value = 0.35;
    this.badTVPass.uniforms['rollSpeed'].value = 0.13;
    this.composer.addPass(this.badTVPass);
  }

  /**
   * On active l'effect BadTVPass.
   * @param value
   */
  setBreakScreen (value: boolean) {
    this.enableBadTVPass = value;
    this.init();
  }

}

const effectManager = new EffectManager();
export default effectManager;
