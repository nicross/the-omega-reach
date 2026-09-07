content.cellar = (() => {
  const lastFloor = -5

  return {
    export: function () {
      return {
        barrier: this.barrier.export(),
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
      this.barrier.import(data.barrier)
      this.deaths.import(data.deaths)
      this.discovered.import(data.discovered)
      this.health.import(data.health)
      this.instruments.import(data.instruments)
      this.position.import(data.position)
      this.run.import(data.run)
      this.scans.import(data.scans)
      this.tiles.import(data.tiles).randomizeUniques()

      return this
    },
    lastFloor: () => lastFloor,
    isOpen: function () {
      return content.conservatory.isReady()
        && !content.shop.isOpen()
        && this.isRunning()
    },
    isRunning: function () {
      return this.health.amount() >= 1
    },
    reset: function () {
      this.barrier.reset()
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
      this.tiles.reset().randomizeUniques()

      this.health.setMax()
      this.barrier.reset()

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
