content.cellar = (() => {
  return {
    export: function () {
      return {
        health: this.health.export(),
        run: this.run.export(),
      }
    },
    import: function (data = {}) {
      this.health.import(data.health)
      this.run.import(data.run)

      return this
    },
    isOpen: function () {
      return content.conservatory.isReady()
        && !content.shop.isOpen()
        && this.isRunning()
    },
    isRunning: function () {
      // TODO: BUT NOT when health == 1 and zero interactive tiles remain, teleport back to shop at this point
      return this.health.amount() > 0
    },
    reset: function () {
      this.health.reset()
      this.run.reset()

      return this
    },
    // Runs
    startRun: function () {
      this.run.increment()
      this.health.setMax()
      this.position.reset()

      return this
    },
  }
})()

engine.state.on('export', (data) => data.cellar = content.cellar.export())
engine.state.on('import', ({cellar}) => content.cellar.import(cellar))
engine.state.on('reset', () => content.cellar.reset())
