import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/shaders/FXAAShader';
import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/OutlinePass';
import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';

export class EffectManager {

  private scene: Scene;
  private renderer: WebGLRenderer;
  private outlinePass: THREE.OutlinePass;
  private composer: THREE.EffectComposer;
  private camera: PerspectiveCamera;
  private height: number;
  private width: number;

  constructor (
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    width: number,
    height: number
  ) {
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.width = width;
    this.height = height;
    // @ts-ignore
    this.composer = new THREE.EffectComposer(this.renderer);
  }

  getOutlinePass () {
    return this.outlinePass;
  }

  getComposer () {
    return this.composer;
  }

  init () {
    // @ts-ignore
    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    this.initOutlinePass();
    // @ts-ignore
    const effect = new THREE.ShaderPass(THREE.FXAAShader);
    // @ts-ignore
    effect.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
    // @ts-ignore
    effect.renderToScreen = true;
    this.composer.addPass(effect);
  }

  initOutlinePass () {
    // @ts-ignore
    this.outlinePass = new THREE.OutlinePass(
      new Vector2(this.width, this.height),
      this.scene,
      this.camera
    );
    this.outlinePass.edgeStrength = 3;
    this.outlinePass.edgeGlow = 0;
    this.outlinePass.edgeThickness = 1;
    this.outlinePass.pulsePeriod = 3;
    this.outlinePass.visibleEdgeColor.set('#ffffff');
    this.composer.addPass(this.outlinePass);
  }
}
