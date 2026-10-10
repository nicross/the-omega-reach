const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('ElectronApi', {
  isHandheld: async () => ipcRenderer.invoke('isHandheld'),
  quit: () => ipcRenderer.send('quit'),
  ready: () => ipcRenderer.send('ready'),
  setFullscreen: (value) => ipcRenderer.send('setFullscreen', value),
})
