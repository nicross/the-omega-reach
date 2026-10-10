const {app, BrowserWindow, ipcMain} = require('electron')

const os = require('os'),
  package = require('../package.json'),
  path = require('path')

let mainWindow,
  steamClient

try {
  steamClient = require('steamworks.js').init(4638520)
} catch (e) {
  // Steam not open, or account doesn't own game.
}

// Improve support for WebGL and Steam overlays
if (os.platform() == 'win32') {
  app.commandLine.appendSwitch('disable-direct-composition')
  app.commandLine.appendSwitch('disable-renderer-backgrounding')
  app.commandLine.appendSwitch('disable-software-rasterizer')
  app.commandLine.appendSwitch('in-process-gpu')
} else {
  app.commandLine.appendSwitch('ignore-gpu-blacklist')
  app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder')
}

function createWindow() {
  mainWindow = new BrowserWindow({
    frame: false,
    fullscreen: true,
    icon: path.join(__dirname, '../public/favicon.png'),
    title: 'THE OMEGA REACH',
    webPreferences: {
      contextIsolation: true,
      devTools: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  // Prevent default hotkeys like Ctrl+R and Ctrl+W
  mainWindow.removeMenu()

  // Handle new windows
  mainWindow.webContents.setWindowOpenHandler(({url}) => {
    if (url.startsWith('https:')) {
      shell.openExternal(url)
    }

    return {
      action: 'deny',
    }
  })

  // Handle permissions requests
  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    switch (permission) {
      case 'midi':
      case 'midiSysex':
      case 'pointerLock':
        return true
    }

    return false
  })

  mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    switch (permission) {
      case 'midi':
      case 'midiSysex':
      case 'pointerLock':
        return callback(true)
    }

    callback(false)
  })

  // Dereference the main window when closed
  mainWindow.on('closed', function () {
    mainWindow = null
  })

  // Uncomment to open developer tools
  //mainWindow.webContents.openDevTools()

  // Load the index file
  mainWindow.loadFile('public/index.html')
}

app.on('ready', () => {
  app.accessibilitySupportEnabled = true
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (!mainWindow) {
    createWindow()
  }
})

ipcMain.on('quit', () => app.quit())

// Handheld support
ipcMain.handle('isHandheld', () => steamClient?.utils.isSteamRunningOnSteamDeck() || false)

// Fullscreen / windowed mode
ipcMain.on('setFullscreen', (e, value) => {
  mainWindow?.setFullScreen(value)
})
