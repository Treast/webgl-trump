/**
 * Configuration de base de notre application.
 *
 * On définit les différentes enveloppes, les adresses du serveur et de la version mobile, ainsi que la position des caméras.
 */

export const CONFIG = {
  DEBUG_MODE: false,
  MOBILE_APP: process.env.MOBILE,
  SERVER: process.env.SERVER,
  GAME: {
    ENVELOPES_NAMES: ['Enveloppe_01', 'Enveloppe__02', 'Enveloppe_03_'],
    CAMERAS: [
      {
        POSITION: { x: 4, y: 3, z: 2 },
      },
      {
        POSITION: { x: -4, y: 3, z: -2 },
      },
      {
        POSITION: { x: -25, y: 13, z: -1 },
      },
    ],
  },
};
