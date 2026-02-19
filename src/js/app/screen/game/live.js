app.screen.game.live = (() => {
  const rootElement = document.querySelector('.a-game--live')

  return {
    set: function (value) {
      rootElement.innerHTML = value
        ? `<span id="${app.utility.dom.generateUniqueId()}">${value}</span>`
        : value

      return this
    },
  }
})()

// Put room description into live region on move when dialog isn't open
// XXX: Probably the most important bit of a11y code
engine.ready(() => {
  app.screen.game.movement.on('move', () => {
    engine.loop.once('frame', () => {
      if (!app.screen.game.dialog.isOpen()) {
        app.screen.game.live.set(
          app.screen.game.info.describe()
        )
      }
    })
  })
})
