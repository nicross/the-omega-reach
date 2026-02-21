content.conservatory = (() => {
  let isReady = false

  return {
    export: () => ({
      ready: isReady,
    }),
    import: function (data = {}) {
      isReady = data.ready || false

      return this
    },
    isOpen: () => isReady && content.instruments.hasScanned(),
    isReady: () => isReady,
    reset: function () {
      isReady = false

      return this
    },
    setReady: function (value) {
      isReady = Boolean(value)

      return this
    },
  }
})()

engine.state.on('export', (data) => data.conservatory = content.conservatory.export())
engine.state.on('import', ({conservatory}) => content.conservatory.import(conservatory))
engine.state.on('reset', () => content.conservatory.reset())
