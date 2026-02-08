engine.ready(() => {
  app.screen.game.dialog.on('advance', () => {
    app.haptics.enqueue({
      duration: 125,
      strongMagnitude: 1,
      weakMagnitude: 1,
    })

    app.haptics.enqueue({
      duration: 125,
      startDelay: 250,
      strongMagnitude: 1,
      weakMagnitude: 1,
    })
  })

  app.screen.game.dialog.on('close', () => {
    app.haptics.enqueue({
      duration: 125,
      strongMagnitude: 1,
      weakMagnitude: 1,
    })
  })
})
