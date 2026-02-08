engine.ready(() => {
  app.screen.game.movement.on('move', ({isNext, isPrevious, isIn, isOut}) => {
    const magnitudeScalar = (isNext || isPrevious || isIn || isOut) ? 0.375 : 0.75
    const timeScalar = (isNext || isPrevious) ? 0.5 : ((isIn || isOut) ? 1.75 : 1)
    const timeScalar2 = (isNext || isPrevious) ? 0.5 : 1

    app.haptics.enqueue({
      duration: 75 * timeScalar,
      strongMagnitude: 1 * magnitudeScalar,
      weakMagnitude: 1 * magnitudeScalar,
    })

    app.haptics.enqueue({
      duration: 75 * timeScalar,
      startDelay: 150 * timeScalar2,
      strongMagnitude: 0.875 * magnitudeScalar,
      weakMagnitude: 0.875 * magnitudeScalar,
    })

    app.haptics.enqueue({
      duration: 75 * timeScalar,
      startDelay: 300 * timeScalar2,
      strongMagnitude: 0.75 * magnitudeScalar,
      weakMagnitude: 0.75 * magnitudeScalar,
    })
  })

  app.screen.game.movement.on('disallowed', () => {
    app.haptics.enqueue({
      duration: 250,
      strongMagnitude: 1,
      weakMagnitude: 1,
    })
  })
})
