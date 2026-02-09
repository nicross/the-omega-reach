engine.ready(() => {
  app.screen.game.movement.on('move', ({isNext, isPrevious, isIn, isOut}) => {
    const magnitudeScalar = (isNext || isPrevious || isIn || isOut) ? 0.5 : 1
    const timeScalar = (isNext || isPrevious) ? 0.5 : ((isIn || isOut) ? 1.75 : 1)
    const timeScalar2 = (isNext || isPrevious) ? 0.5 : 1

    app.haptics.enqueue({
      duration: 75 * timeScalar,
      strongMagnitude: 1 * magnitudeScalar * 0.5,
      weakMagnitude: 1 * magnitudeScalar * 0.5,
    })

    app.haptics.enqueue({
      duration: 75 * timeScalar,
      startDelay: 125 * timeScalar2,
      strongMagnitude: 0.75 * magnitudeScalar * 0.5,
      weakMagnitude: 0.75 * magnitudeScalar * 0.5,
    })

    app.haptics.enqueue({
      duration: 75 * timeScalar,
      startDelay: 250 * timeScalar2,
      strongMagnitude: 0.875 * magnitudeScalar * 0.5,
      weakMagnitude: 0.875 * magnitudeScalar * 0.5,
    })
  })

  app.screen.game.movement.on('disallowed', () => {
    app.haptics.enqueue({
      duration: 150,
      strongMagnitude: 1,
      weakMagnitude: 1,
    })
  })
})
