content.stockroom = (() => {
  const generated = new Set(),
    instruments = new Map(),
    stolen = new Set()

  let steals = 0

  return {
    countGenerated: () => generated.size,
    countStolen: () => stolen.size,
    export: () => ({
      generated: [...generated],
      stolen: [...stolen],
      steals,
    }),
    generate: function () {
      const count = engine.fn.clamp(Math.round(
        engine.fn.scale(
          content.cellar.deaths.count(),
          0, 8,
          0, 5,
        )
      ), 0, 5)

      for (let i = 0; i < count; i += 1) {
        const name = Math.random() < 0.5
          ? content.cellar.instruments.generateUniqueName()
          : content.shop.generateUniqueName()

        generated.add(name)
        instruments.set(name, content.instruments.generateEphemeral(name))
      }

      return this
    },
    generated: () => [...generated],
    getInstrument: (name) => instruments.get(name),
    hasGenerated: () => generated.size > 0,
    hasStolen: () => stolen.size > 0,
    import: function ({
      generated: generatedNames = [],
      stolen: stolenNames = [],
      steals: stolenCount = 0,
    } = {}) {
      for (const name of generatedNames) {
        generated.add(name)
        instruments.set(name, content.instruments.generateEphemeral(name))
      }

      for (const name of stolenNames) {
        stolen.add(name)
      }

      steals += 1

      return this
    },
    isGenerated: (name) => generated.has(name),
    isStolen: (name) => stolen.has(name),
    keepStolen: function () {
      for (const name of stolen) {
        if (!content.instruments.has(name)) {
          content.instruments.add(name, instruments.get(name)?.state)
          generated.delete(name)
          steals += 1
        }
      }

      stolen.clear()

      return this
    },
    reset: function () {
      generated.clear()
      instruments.clear()
      stolen.clear()

      steals = 0

      return this
    },
    steal: function (name) {
      stolen.add(name)

      return this
    },
    stealCount: () => steals,
    stolen: () => [...stolen],
    unsteal: function (name) {
      stolen.delete(name)

      return this
    },
  }
})()

engine.state.on('export', (data) => data.stockroom = content.stockroom.export())
engine.state.on('import', ({stockroom}) => content.stockroom.import(stockroom))
engine.state.on('reset', () => content.stockroom.reset())
