engine.ready(() => {
  app.screen.game.dialog.on('advance', (e) => {
    content.audio.dialog.trigger()
  })
})
