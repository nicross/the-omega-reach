content.video = (() => {
  let isLoaded = false

  return {
    draw: function () {
      if (!isLoaded || !content.gl.isActive()) {
        return this
      }

      content.gl.clear()

      this.interactions.draw()
      this.grain.draw()

      return this
    },
    load: function () {
      if (isLoaded || !content.gl.isActive()) {
        return this
      }

      this.grain.load()
      this.interactions.load()

      isLoaded = true

      return this
    },
    unload: function () {
      if (!isLoaded) {
        return this
      }

      this.grain.unload()
      this.interactions.unload()

      isLoaded = false

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  content.video.draw()
})

engine.state.on('import', () => content.video.load())
engine.state.on('reset', () => content.video.unload())
