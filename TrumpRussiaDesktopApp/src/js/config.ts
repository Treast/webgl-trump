export const CONFIG = {
  DEBUG_MODE: false,
  MOBILE_APP: {
    HOST: '192.168.1.14',
    PORT: 9000,
  },
  SERVER: {
    HOST: 'localhost',
    PORT: 3000,
  },
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
