content.cellar = (() => {
  return {
    export: function () {
      return {
        deaths: this.deaths.export(),
        discovered: this.discovered.export(),
        health: this.health.export(),
        instruments: this.instruments.export(),
        position: this.position.export(),
        run: this.run.export(),
        scans: this.scans.export(),
        tiles: this.tiles.export(),
      }
    },
    import: function (data = {}) {
      this.deaths.import(data.deaths)
      this.discovered.import(data.discovered)
      this.health.import(data.health)
      this.instruments.import(data.instruments)
      this.position.import(data.position)
      this.run.import(data.run)
      this.scans.import(data.scans)
      this.tiles.import(data.tiles)

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
      this.deaths.reset()
      this.discovered.reset()
      this.health.reset()
      this.instruments.reset()
      this.run.reset()
      this.scans.reset()
      this.tiles.reset()

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

      content.stockroom.reset().generate()

      return this
    },
  }
})()

engine.state.on('export', (data) => data.cellar = content.cellar.export())
engine.state.on('import', ({cellar}) => content.cellar.import(cellar))
engine.state.on('reset', () => content.cellar.reset())
