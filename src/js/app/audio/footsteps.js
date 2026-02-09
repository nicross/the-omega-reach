engine.ready(() => {
  app.screen.game.movement.on('move', (e) => {
    if (!e.isFootstep) {
      return
    }

    content.audio.footsteps.trigger({
      pan: e.direction == 'left' ? 0.5 : (e.direction == 'right' ? -0.5 : 0),
    })
  })
})
