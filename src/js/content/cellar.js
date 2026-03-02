content.cellar = (() => {
  return {
    export: function () {
      return {
        discovered: this.discovered.export(),
        health: this.health.export(),
        instruments: this.instruments.export(),
        position: this.position.export(),
        run: this.run.export(),
        scans: this.scans.export(),
      }
    },
    import: function (data = {}) {
      this.discovered.import(data.discovered)
      this.health.import(data.health)
      this.instruments.import(data.instruments)
      this.position.import(data.position)
      this.run.import(data.run)
      this.scans.import(data.scans)

      return this
    },
    isOpen: function () {
      return content.conservatory.isReady()
        && !content.shop.isOpen()
        && this.isRunning()
    },
    isRunning: function () {
      const health = this.health.amount()

      // TODO: BUT NOT when health == 1 and zero interactive tiles remain, teleport back to shop at this point
      return health >= 1
    },
    reset: function () {
      this.discovered.reset()
      this.health.reset()
      this.instruments.reset()
      this.run.reset()
      this.scans.reset()

      return this
    },
    // Runs
    startRun: function () {
      this.run.increment()

      this.discovered.reset()
      this.position.reset()
      this.scans.reset()
      this.tiles.reset()

      this.health.setMax()
      this.discovered.set(this.position.get())
      content.audio.cellarInteractives.reset()

      return this
    },
  }
})()

engine.state.on('export', (data) => data.cellar = content.cellar.export())
engine.state.on('import', ({cellar}) => content.cellar.import(cellar))
engine.state.on('reset', () => content.cellar.reset())
