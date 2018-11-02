/**
 * Vérifie que le DOM est prêt.
 * @param callback
 */

export function onDomReady(callback: () => void) {
  if (document.readyState !== 'loading') callback();
  else  document.addEventListener('DOMContentLoaded', callback);
}
