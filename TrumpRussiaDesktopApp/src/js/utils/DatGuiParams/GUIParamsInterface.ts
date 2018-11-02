import * as dat from 'dat.gui';

export interface GUIParamsInterface {
  enable: boolean;
  init(gui: dat.GUI): void;
  render(): void;
}
