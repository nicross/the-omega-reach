engine.ready(() => {
  app.screen.game.dialog.on('advance', () => {
    app.haptics.enqueue({
      duration: 75,
      strongMagnitude: 1 * 0.75,
      weakMagnitude: 1 * 0.75,
    })

    app.haptics.enqueue({
      duration: 75,
      startDelay: 150,
      strongMagnitude: 1 * 0.75,
      weakMagnitude: 1 * 0.75,
    })
  })

  app.screen.game.dialog.on('close', () => {
    app.haptics.enqueue({
      duration: 75,
      strongMagnitude: 1,
      weakMagnitude: 1,
    })
  })
})
