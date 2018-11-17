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
  FLAGS: [
    {
      name: 'drapeau',
      parent: 'Drapeau1',
      windForce: 0.001,
      texture: './assets/american_flag.jpg',
    },
    {
      name: 'drapeau',
      parent: 'Drapeau1.1',
      windForce: 0.001,
      texture: './assets/russian_flag.jpg',
    },
  ],
  SOUNDS: [
    'BasseFond.mp3',
    'ChangerCam.wav',
    'clickBouton.wav',
    'EnveloppeRecoltee.wav',
    {
      sound: 'Musique_IntroFin.mp3',
      volume: 0.1,
    },
    'TimmerDepart.wav',
  ],
};
