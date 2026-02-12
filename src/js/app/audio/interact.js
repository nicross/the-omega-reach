engine.ready(() => {
  app.screen.game.interact.on('trigger', ({room}) => content.audio.interactSuccess.trigger({
    index: room.getInteractJingle(),
  }))

  content.location.on('interact-complete', () => content.audio.interactComplete.trigger())
})

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.audio.interactProximity.update({
    value: app.screen.game.interact.proximity(),
    vector: content.location.get().solution,
  })

  content.audio.interactValue.update(app.screen.game.interact.value())
})
