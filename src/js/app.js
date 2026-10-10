const app = (() => {
  const readyContext = {}

  const ready = new Promise((resolve, reject) => {
    readyContext.resolve = resolve
    readyContext.reject = reject
  })

  let capsuleTimeout,
    isActive = false,
    isCapsule = false,
    isImmersive = false,
    root

  return {
    activate: function () {
      isActive = true
      readyContext.resolve()

      return this
    },
    component: {},
    isActive: () => isActive,
    isCapsule: () => isCapsule,
    isDebug: () => Boolean(app.debug),
    isDemo: () => Boolean(app.demo),
    isImmersive: () => isImmersive,
    isElectron: () => typeof ElectronApi != 'undefined',
    name: () => 'shiftbacktick/omega-reach',
    quit: function () {
      app.haptics.kill()

      if (this.isElectron()) {
        ElectronApi.quit()
      }

      return this
    },
    preActivate: function () {
      root = document.querySelector('.a-app')
      root.classList.add('a-app-active')

      return this
    },
    ready: async (callback) => {
      return typeof callback == 'function'
        ? readyContext.then(callback)
        : readyContext
    },
    screen: {},
    setCapsule: function (value) {
      isCapsule = Boolean(value)

      if (isCapsule) {
        root.classList.add('a-app-capsule')
        capsuleTimeout = setTimeout(() => content.particles.setSpeed(0), 1000)
      } else {
        root.classList.remove('a-app-capsule')
        clearTimeout(capsuleTimeout)
        content.particles.setSpeed(1)
      }

      return this
    },
    setImmersive: function (value) {
      isImmersive = Boolean(value)

      if (isImmersive) {
        root.classList.add('a-app-immersive')
      } else {
        root.classList.remove('a-app-immersive')
      }

      return this
    },
    setRunning: function (value) {
      if (value) {
        root.classList.add('a-app-running')
      } else {
        root.classList.remove('a-app-running')
      }

      return this
    },
    setPaused: function (value) {
      if (value) {
        root.classList.add('a-app-paused')
      } else {
        root.classList.remove('a-app-paused')
      }

      return this
    },
    setUiScale: function (value) {
      document.documentElement.style.setProperty(`--ui-scale`, value)

      return this
    },
    utility: {},
    version: () => '0.0.0', // Replaced via Gulpfile.js
  }
})()
