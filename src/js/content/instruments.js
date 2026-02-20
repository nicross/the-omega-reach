content.instruments = (() => {
  const generated = new Map(),
    states = new Map()

  const defaultState = {}

  function firstName() {
    for (const name of states.keys()) {
      return name
    }
  }

  function generate(name) {
    const isTutorial = [undefined, name].includes(firstName())

    const srand = (...seed) => engine.fn.srand('instrument', name, 'attribute', ...seed)()
    const rarity = srand('rarity') * (isTutorial ? 1/8 : 1)

    const instrument = {
      name,
      quirks: [],
      rarityLabel: engine.fn.choose([
        'Common',
        'Uncommon',
        'Rare',
        'Legendary',
      ], rarity),
      rarity,
      value: engine.fn.lerp(10, 100, rarity),
    }

    const quirks = generateQuirks(srand)
    quirks.common = engine.fn.shuffle(quirks.common, engine.fn.srand(srand('sort','common')))
    quirks.rare = engine.fn.shuffle(quirks.rare, engine.fn.srand(srand('sort','rare')))

    let multiplier = 1

    if (quirks.common.length && (isTutorial || srand('quirk', 'common1', 'roll') < rarity)) {
      instrument.quirks.push({
        name: engine.fn.chooseSplice(
          quirks.common,
          srand('quirk', 'common1', 'type')
        ),
      })

      multiplier += 1/6
    }

    if (!isTutorial && quirks.common.length && srand('quirk', 'common2', 'roll') < rarity) {
      instrument.quirks.push({
        name: engine.fn.chooseSplice(
          quirks.common,
          srand('quirk', 'common2', 'type')
        ),
      })

      multiplier += 1/6
    }

    if (!isTutorial && quirks.rare.length && srand('quirk', 'rare1', 'roll') < rarity) {
      instrument.quirks.push({
        isRare: true,
        name: engine.fn.chooseSplice(
          quirks.rare,
          srand('quirk', 'rare1', 'type')
        ),
      })

      multiplier += 1/3
    }

    if (!isTutorial && quirks.rare.length && srand('quirk', 'rare2', 'roll') < rarity) {
      instrument.quirks.push({
        isRare: true,
        name: engine.fn.chooseSplice(
          quirks.rare,
          srand('quirk', 'rare2', 'type')
        ),
      })

      multiplier += 1/3
    }

    instrument.value = Math.ceil(instrument.value * multiplier)

    return instrument
  }

  function generateQuirks(srand) {
    const common = [
      'Branded',
      'Replica',
      'Smuggled',
      'Stolen',
    ]

    const rare = [
      'Autographed',
      'Forbidden',
      'Obscure',
      'Priceless',
      'Renown owner',
    ]

    // Type
    if (srand('type','rarity') < 1/2) {
      rare.push('Electronic')
    } else {
      common.push('Acoustic')
    }

    // Size
    common.push(
      engine.fn.choose(['Handheld','Upright','Free standing'], srand('size','roll'))
    )

    // Handedness
    if (srand('handedness','rarity') < 1/2) {
      rare.push('Left handed')
    } else {
      common.push('Right handed')
    }

    // Edibility
    if (srand('edibility','rarity') < 2/3) {
      rare.push(
        engine.fn.choose(['Edible','Edible once'], srand('edibility','roll'))
      )
    } else {
      common.push('Inedible')
    }

    // Design
    if (srand('design','rarity') < 2/7) {
      rare.push(
        engine.fn.choose(['Commemorative','Ornate'], srand('design','roll')) + ' design'
      )
    } else {
      common.push(
        engine.fn.choose(['Complex','Compact','Ergonomic','Functional'], srand('design','roll')) + ' design'
      )
    }

    // Lore
    if (srand('lore','rarity') < 3/9) {
      rare.push(
        engine.fn.choose(['Epic','Legendary','Mythical'], srand('lore','roll')) + ' lore'
      )
    } else {
      common.push(
        engine.fn.choose(['Cultural','Fictional','Political','Scientific','Religious','Wartime'], srand('lore','roll')) + ' lore'
      )
    }

    // Material
    if (srand('material','rarity') < 4/7) {
      rare.push(
        engine.fn.choose(['Exotic','Living','Radioactive','Synthetic'], srand('material','roll')) + ' matter'
      )
    } else {
      common.push(
        engine.fn.choose(['Metallic','Organic','Silicate'], srand('material','roll')) + ' matter'
      )
    }

    // Period
    if (srand('period','rarity') < 2/6) {
      rare.push(
        engine.fn.choose(['Ancient','Extinction'], srand('period','roll')) + ' period'
      )
    } else {
      common.push(
        engine.fn.choose(['Classical','Modern','Retro','Futuristic'], srand('period','roll')) + ' period'
      )
    }

    // Quality
    if (srand('quality','rarity') < 1/2) {
      rare.push(
        engine.fn.choose(['Fine','Very fine','Near mint','Mint'], srand('quality','roll')) + ' condition'
      )
    } else {
      common.push(
        engine.fn.choose(['Poor','Fair','Good','Very good'], srand('quality','roll')) + ' condition'
      )
    }

    return {
      common,
      rare,
    }
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
    generateNameForBody: function (bodyName) {
      const shortName = bodyName.split(' ').slice(-2).join(' ')

      let name

      do {
        const prefix = engine.fn.choose([
          'Air',
          'Call',
          'Drone',
          'Echo',
          'Hymn',
          'Lyric',
          'Melody',
          'Note',
          'Psalm',
          'Rhyme',
          'Sound',
          'Tone',
          'Vibe',
        ], Math.random())

        name = `${prefix} of ${shortName}`
      } while (states.has(name))

      return name
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
