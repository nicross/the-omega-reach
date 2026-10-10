const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('ElectronApi', {
  isHandheld: async () => ipcRenderer.invoke('isHandheld'),
  quit: () => ipcRenderer.send('quit'),
  setFullscreen: (value) => ipcRenderer.send('setFullscreen', value),
})
