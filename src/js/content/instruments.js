content.instruments = (() => {
  const generated = new Map(),
    states = new Map()

  const defaultState = {}

  const commonQuirks = [
    'Common quirk',
    'Common quirk',
  ]

  const rareQuirks = [
    'Rare quirk',
    'Rare quirk',
  ]

  function generate(name) {
    const isTutorial = name.includes(content.const.tutorialName)

    const srand = (seed) => engine.fn.srand('instrument', name, 'attribute', seed)()

    const rarity = isTutorial ? 0 : srand('rarity')

    const instrument = {
      name,
      quirks: [],
      rarity: engine.fn.chooseWeighted([
        {label: 'Common', weight: 1},
        {label: 'Uncommon', weight: 0.5},
        {label: 'Rare', weight: 0.25},
        {label: 'Legendary', weight: 0.125},
      ], rarity).label,
    }

    const quirks = {
      common: [...commonQuirks],
      rare: [...rareQuirks],
    }

    if (isTutorial || quirks.common.length && srand('quirk', 'common1', 'roll') < rarity) {
      instrument.quirks.push({
        name: engine.fn.chooseSplice(
          quirks.common,
          srand('quirk', 'common1', 'type')
        ),
      })
    }

    if (!isTutorial && quirks.common.length && srand('quirk', 'common2', 'roll') < rarity/2) {
      instrument.quirks.push({
        name: engine.fn.chooseSplice(
          quirks.common,
          srand('quirk', 'common2', 'type')
        ),
      })
    }

    if (!isTutorial && quirks.rare.length && srand('quirk', 'rare', 'roll') < rarity/3) {
      instrument.quirks.push({
        isRare: true,
        name: engine.fn.chooseSplice(
          quirks.rare,
          srand('quirk', 'rare', 'type')
        ),
      })
    }

    if (!isTutorial && quirks.rare.length && srand('quirk', 'rare', 'roll') < rarity/4) {
      instrument.quirks.push({
        isRare: true,
        name: engine.fn.chooseSplice(
          quirks.rare,
          srand('quirk', 'rare', 'type')
        ),
      })
    }

    return instrument
  }

  return {
    add: function (name) {
      states.set(name, {...defaultState})

      return this
    },
    count: () => states.size,
    export: function () {
      const data = {}

      for (const [name, {name: _name, ...state}] of states.entries()) {
        data[name] = state
      }

      return data
    },
    get: function (name) {
      if (!generated.has(name)) {
        generated.set(name, generate(name))
      }

      if (!states.has(name)) {
        states.set(name, {...defaultState})
      }

      const instrument = generated.get(name)
      instrument.state = states.get(name)

      return instrument
    },
    getFirstUnscannedName: function () {
      for (const [name, state] of states.entries()) {
        if ((state.scans || 0) <= 0) {
          return name
        }
      }
    },
    has: (name) => states.has(name),
    hasUnscanned: function () {
      return Boolean(this.getFirstUnscannedName())
    },
    import: function (data = {}) {
      for (const [name, state] of Object.entries(data)) {
        states.set(name, {name, ...state})
      }

      return this
    },
    names: () => [...states.keys()],
    remove: function (name) {
      generated.delete(name)
      states.delete(name)

      return this
    },
    reset: function () {
      generated.clear()
      states.clear()

      return this
    },
  }
})()

engine.state.on('import', ({instruments}) => content.instruments.import(instruments))
engine.state.on('export', (data) => data.instruments = content.instruments.export())
engine.state.on('reset', () => content.instruments.reset())
