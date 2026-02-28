engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  const program = content.programs.get()

  if (!program) {
    return
  }

  const max = app.controls.interactions.points().reduce(
    (max, point) => Math.max(max, program.getRumbleRotated(point) * point.depth),
    0
  )

  if (!max) {
    return
  }

  const factor = content.location.is('cellar') && !content.solution.has()
    ? 1
    : 0.25

  app.haptics.enqueue({
    duration: engine.loop.delta() * 1000,
    strongMagnitude: (max ** 2) * (Math.random()) * factor,
    weakMagnitude: (max ** 2) * (Math.random()) * factor,
  })
})
