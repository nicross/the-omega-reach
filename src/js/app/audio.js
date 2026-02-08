app.audio = (() => {
  const bus = engine.mixer.createBus()
  bus.gain.value = engine.fn.fromDb(-6)

  return {
    bus: () => bus,
  }
})()
