engine.ready(() => {
  app.screen.game.movement.on('move', (e) => {
    // Footstep
    if (e.isFootstep) {
      return content.audio.footsteps.trigger({
        pan: e.direction == 'left' ? 0.5 : (e.direction == 'right' ? -0.5 : 0),
      })
    }

    // Next
    if (e.isNext) {
      return content.audio.calibration.trigger({
        pan: 0.75,
      })
    }

    // Previous
    if (e.isPrevious) {
      return content.audio.calibration.trigger({
        pan: -0.75,
      })
    }

    // In
    if (e.isIn) {
      return content.audio.zoom.trigger({
        isIn: true,
      })
    }

    // Out
    if (e.isOut) {
      return content.audio.zoom.trigger({
        isIn: false,
      })
    }
  })

  // Handle zooms when interacting with horizon and galaxy
  app.screen.game.interact.on('trigger', ({room}) => {
    if (['horizon','galaxy'].includes(room.id)) {
      return content.audio.zoom.trigger({
        isIn: true,
      })
    }
  })
})
