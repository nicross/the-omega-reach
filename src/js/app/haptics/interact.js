engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  const value = engine.fn.clamp(
      app.screen.game.interact.value()
    + ((app.screen.game.interact.proximity() ** 2) * 0.75)
  )

  if (!value) {
    return
  }

  app.haptics.enqueue({
    duration: engine.loop.delta() * 1000,
    strongMagnitude: value,
    weakMagnitude: value,
  })
})

engine.ready(() => {
  app.screen.game.interact.on('trigger', () => {
    app.haptics.enqueue({
      duration: 75,
      startDelay: 125,
      strongMagnitude: 1,
      weakMagnitude: 1,
    })

    app.haptics.enqueue({
      duration: 75,
      startDelay: 125 + 150,
      strongMagnitude: 0.75,
      weakMagnitude: 0.75,
    })
  })
})
