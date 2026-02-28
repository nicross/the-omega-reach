content.cellar = (() => {
  return {
    export: function () {
      return {}
    },
    import: function (data = {}) {
      return this
    },
    isOpen: () => content.conservatory.isReady() && !content.shop.isOpen(),
    reset: function () {
      return this
    },
  }
})()

engine.state.on('export', (data) => data.cellar = content.cellar.export())
engine.state.on('import', ({cellar}) => content.cellar.import(cellar))
engine.state.on('reset', () => content.cellar.reset())
