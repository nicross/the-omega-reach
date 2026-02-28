content.cellar = (() => {
  return {
    export: function () {
      return {
        discovered: this.discovered.export(),
        health: this.health.export(),
        position: this.position.export(),
        run: this.run.export(),
      }
    },
    import: function (data = {}) {
      this.discovered.import(data.discovered)
      this.health.import(data.health)
      this.position.import(data.position)
      this.run.import(data.run)

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
      this.run.reset()

      return this
    },
    // Runs
    startRun: function () {
      this.run.increment()
      this.health.setMax()
      this.position.reset()
      this.discovered.reset().set(this.position.get())

      return this
    },
  }
})()

engine.state.on('export', (data) => data.cellar = content.cellar.export())
engine.state.on('import', ({cellar}) => content.cellar.import(cellar))
engine.state.on('reset', () => content.cellar.reset())
