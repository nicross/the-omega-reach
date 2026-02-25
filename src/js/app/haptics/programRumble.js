engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  const program = content.programs.get()

  if (!program) {
    return
  }

  const max = app.controls.interactions.points().reduce(
    (max, point) => Math.max(max, program.getRumble(point) * point.depth),
    0
  )

  if (!max) {
    return
  }

  app.haptics.enqueue({
    duration: engine.loop.delta() * 1000,
    strongMagnitude: (max ** 2) * (Math.random()) * 1/4,
    weakMagnitude: (max ** 2) * (Math.random()) * 1/4,
  })
})
