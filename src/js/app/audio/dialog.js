engine.ready(() => {
  app.screen.game.dialog.on('advance', (e) => {
    content.audio.dialog.trigger()
  })

  app.screenManager.on('enter', ({currentState}) => {
    if (!['splash','game'].includes(currentState)) {
      content.audio.dialog.trigger()
    }
  })
})
