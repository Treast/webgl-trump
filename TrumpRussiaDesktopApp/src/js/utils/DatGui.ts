import * as dat from 'dat.gui';
import { CONFIG } from '../config';
import { GUIParamsFilmPass } from './DatGuiParams/GUIParamsFilmPass';
import { GUIParamsBadTVPass } from './DatGuiParams/GUIParamsBadTVPass';

export const DAT_GUI = {

  params: {
    filmPass: new GUIParamsFilmPass(),
    badTvPadd: new GUIParamsBadTVPass(),
  },

  gui: CONFIG.DEBUG_MODE ? new dat.GUI() : null,

  init () {
    Object.keys(this.params).forEach((name: string) => {
      if (this.gui !== null && this.params[name].enable) {
        const folder = this.gui.addFolder(name);
        this.params[name].init(folder);
      }
    });
  },

  render () {
    Object.keys(this.params).forEach((name: string) => {
      if (this.gui !== null && this.params[name].enable) {
        this.params[name].render();
      }
    });
  },

};
