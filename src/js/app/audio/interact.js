engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.audio.interactValue.update(app.screen.game.interact.value())
})
