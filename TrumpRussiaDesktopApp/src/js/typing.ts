import { Mesh, Object3D } from "three";

export interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
}

export interface Envelope {
  object: Object3D;
  boundingBox: Mesh
}