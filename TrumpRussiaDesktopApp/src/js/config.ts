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
    CAMERAS_NAMES: [
      'Caméra',
      'Caméra.1',
      'Caméra.2',
    ],
    ENVELOPES_NAMES: [
      'Enveloppe_01',
      'Enveloppe_02',
      'Enveloppe_03',
      'Enveloppe_04',
      'Enveloppe_05',
      'Enveloppe_06',
      'Enveloppe_07',
      'Enveloppe_08',
      'Enveloppe_09',
      'Enveloppe_10',
    ],
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
      parent: 'AmericanFlag',
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
