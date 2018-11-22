import {
  DoubleSide,
  LinearFilter, MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  RGBFormat,
  VideoTexture,
} from 'three';

export class VideoObject {

  static apply (videoId: string, object: Object3D) {
    const video = document.getElementById(videoId) as HTMLVideoElement;
    // @ts-ignore
    object.material = object.material.clone();
    // @ts-ignore
    object.material = new MeshBasicMaterial();
    // @ts-ignore
    object.material.side = DoubleSide;
    // @ts-ignore
    object.material.map = this.createTexture(video);
    // @ts-ignore
    object.material.needsUpdate = true;
    video.volume = 0;
    video.play();
  }

  static createTexture (video: HTMLVideoElement): VideoTexture {
    const texture = new VideoTexture(video);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.format = RGBFormat;
    texture.needsUpdate = true;
    return texture;
  }

}
