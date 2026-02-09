engine.ready(() => {
  app.screen.game.movement.on('move', (e) => {
    // Footsteps
    if (e.isFootstep) {
      return content.audio.footsteps.trigger({
        pan: e.direction == 'left' ? 0.5 : (e.direction == 'right' ? -0.5 : 0),
      })
    }

    // Next
    if (e.isNext) {
      return content.audio.calibration.trigger({
        pan: 1,
      })
    }

    // Previous
    if (e.isPrevious) {
      return content.audio.calibration.trigger({
        pan: -1,
      })
    }
  })
})
