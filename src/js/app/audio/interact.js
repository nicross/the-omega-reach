engine.ready(() => {
  app.screen.game.interact.on('trigger', () => content.audio.interactSuccess.trigger())
  content.location.on('interact-complete', () => content.audio.interactComplete.trigger())
})

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.audio.interactValue.update(app.screen.game.interact.value())
})
