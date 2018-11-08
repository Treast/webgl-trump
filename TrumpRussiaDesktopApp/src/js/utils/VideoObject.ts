import {
  LinearFilter,
  MeshLambertMaterial,
  Object3D,
  RGBFormat,
  VideoTexture,
} from 'three';

export class VideoObject {

  static apply (videoId: string, object: Object3D) {
    const video = document.getElementById(videoId) as HTMLVideoElement;
    // @ts-ignore
    /*object.materials = new MeshLambertMaterial({
      map: this.createTexture(video),
      color: 0xffffff
    });*/

    /* That it work !*/
    object.traverse((node: Object3D) => {
      // @ts-ignore
      if (node.isMesh) {
        // @ts-ignore
        node.material.map = this.createTexture(video);
      }
    });
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
