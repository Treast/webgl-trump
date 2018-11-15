/**
 * Types que nous avons définis.
 */

import { Mesh, Object3D } from 'three';

export interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
}

export interface Envelope {
  object: Object3D;
  boundingBox: Mesh;
  name: string;
}

export interface FlagInformations {
  name: string;
  parent: string;
  windForce: number;
}

export interface TimerValue {
  minutes: string;
  seconds: string;
}
