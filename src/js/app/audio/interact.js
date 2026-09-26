engine.ready(() => {
  app.screen.game.interact.on('trigger', ({action, room}) => {
    if (['Return','Sell','Steal'].includes(action)) {
      return
    }

    if (room.id == 'cellar' && content.cellar.tiles.current().isUnique) {
      return
    }

    content.audio.interactSuccess.trigger({
      index: room.getInteractJingle(),
    })
  })

  content.location.on('interact-complete', () => {
    if (!content.location.is('cellar')) {
      content.audio.interactComplete.trigger()
    }
  })

  // XXX: Kill the proximity synth
  app.screen.game.dialog.on('advance', (e) => {
    app.screen.game.interact.setProximity(0)
    content.audio.interactProximity.reset()
  })

  app.screen.game.movement.on('move', (e) => {
    app.screen.game.interact.setProximity(0)
    content.audio.interactProximity.reset()
  })
})

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  const solution = content.solution.get()

  content.audio.interactProximity.update({
    value: solution ? app.screen.game.interact.proximity() : 0,
    vector: solution,
  })

  content.audio.interactValue.update(app.screen.game.interact.value())
})
