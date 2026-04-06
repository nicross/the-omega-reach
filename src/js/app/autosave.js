app.autosave = (() => {
  const autosaveInterval = 30

  let active = false,
    timeout

  function save() {
    app.storage.game.save()
  }

  function saveLoop() {
    save()
    scheduleSaveLoop()
  }

  function scheduleSaveLoop() {
    timeout = setTimeout(saveLoop, autosaveInterval * 1000)
  }

  return {
    disable: function () {
      active = false

      if (timeout) {
        timeout = clearTimeout(timeout)
      }

      return this
    },
    enable: function () {
      if (active) {
        return this
      }

      active = true
      scheduleSaveLoop()

      return this
    },
    trigger: function () {
      if (active) {
        timeout = clearTimeout(timeout)
      }

      setTimeout(save, 0)

      if (active) {
        scheduleSaveLoop()
      }

      return this
    },
  }
})()

engine.ready(() => {
  // Autosave whenever completing rooms (except stockroom)
  content.location.on('interact-complete', () => {
    if (!content.location.is('stockroom')) {
      app.autosave.trigger()
    }
  })

  // Autosave whenever entering atrium
  content.location.on('enter', () => {
    if (content.location.is('atrium')) {
      app.autosave.trigger()
    }
  })
})
