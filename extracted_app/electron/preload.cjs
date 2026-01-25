const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  isDesktopApp: true
});

// Add class to body when DOM is ready to hide download section
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-desktop-app');
});
