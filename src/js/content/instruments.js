content.instruments = (() => {
  const generated = new Map(),
    states = new Map()

  const defaultState = {
    scans: 0,
    time: 0,
  }

  function firstName() {
    for (const name of states.keys()) {
      return name
    }
  }

  function generate(name) {
    const isTutorial = name.includes(content.scans.firstMoon().split(' ').slice(-2).join(' '))

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
      state: {},
      value: engine.fn.lerp(10, 100, rarity),
    }

    const quirks = generateQuirks(srand)
    quirks.common = engine.fn.shuffle(quirks.common, engine.fn.srand(srand('sort','common')))
    quirks.rare = engine.fn.shuffle(quirks.rare, engine.fn.srand(srand('sort','rare')))

    let multiplier = 1

    if (isTutorial) {
      instrument.quirks.push({
        name: 'Stolen',
      })

      multiplier += 1/6
    } else {
      if (quirks.common.length && srand('quirk', 'common1', 'roll') < rarity) {
        instrument.quirks.push({
          name: engine.fn.chooseSplice(
            quirks.common,
            srand('quirk', 'common1', 'type')
          ),
        })

        multiplier += 1/6
      }

      if (quirks.common.length && srand('quirk', 'common2', 'roll') < rarity) {
        instrument.quirks.push({
          name: engine.fn.chooseSplice(
            quirks.common,
            srand('quirk', 'common2', 'type')
          ),
        })

        multiplier += 1/6
      }

      if (quirks.rare.length && srand('quirk', 'rare1', 'roll') < rarity) {
        instrument.quirks.push({
          isRare: true,
          name: engine.fn.chooseSplice(
            quirks.rare,
            srand('quirk', 'rare1', 'type')
          ),
        })

        multiplier += 1/3
      }

      if (quirks.rare.length && srand('quirk', 'rare2', 'roll') < rarity) {
        instrument.quirks.push({
          isRare: true,
          name: engine.fn.chooseSplice(
            quirks.rare,
            srand('quirk', 'rare2', 'type')
          ),
        })

        multiplier += 1/3
      }
    }

    instrument.value = Math.ceil(instrument.value * multiplier)

    return instrument
  }

  function generateQuirks(srand) {
    const common = [
      'Counterfeit',
      'Replica',
      'Smuggled',
      'Stolen',
    ]

    const rare = [
      'Autographed',
      'Forbidden',
      'Holographic',
      'Priceless',
    ]

    // Generic
    if (srand('generic','rarity') < 1/2) {
      rare.push(
        engine.fn.choose(['Esoteric','Handmade','Obscure'], srand('generic','roll'))
      )
    } else {
      common.push(
        engine.fn.choose(['Branded','Generic','Readymade'], srand('generic','roll'))
      )
    }

    // Type
    if (srand('type','rarity') < 1/2) {
      rare.push('Electronic')
      rare.push(
        engine.fn.choose(['Amplified','Electrophone','Sampler','Synthesizer'], srand('type','roll'))
      )
    } else {
      common.push('Acoustic')
      common.push(
        engine.fn.choose(['Aerophone','Chordophone','Ideophone','Membranophone'], srand('type','roll'))
      )
    }

    // Size
    common.push(
      engine.fn.choose(['Handheld','Mounted','Upright','Free standing'], srand('size','roll'))
    )

    // Owner
    rare.push(
      engine.fn.choose(['Famous','Iconic','Infamous','Renown'], srand('size','roll')) + ' owner'
    )

    // Skill level
    if (srand('skill','rarity') < 1/2) {
      rare.push(
        engine.fn.choose(['Advanced','Professional','Maestro'], srand('skill','roll')) + ' level'
      )
    } else {
      common.push(
        engine.fn.choose(['Toy','Beginner level','Intermediate level'], srand('skill','roll'))
      )
    }

    // Handedness
    if (srand('handedness','rarity') < 3/4) {
      rare.push(
        engine.fn.choose(['Ambidextrous','Left handed','No handed'], srand('handedness','roll'))
      )
    } else {
      common.push('Right handed')
    }

    // Edibility
    if (srand('edibility','rarity') < 1/2) {
      rare.push(
        engine.fn.choose(['Edible','Edible once'], srand('edibility','roll'))
      )
    } else {
      common.push(
        engine.fn.choose(['Inedible','Toxic'], srand('edibility','roll'))
      )
    }

    // Design
    if (srand('design','rarity') < 3/7) {
      rare.push(
        engine.fn.choose(['Commemorative','Decorative','Ornate'], srand('design','roll')) + ' design'
      )
    } else {
      common.push(
        engine.fn.choose(['Complex','Compact','Ergonomic','Functional'], srand('design','roll')) + ' design'
      )
    }

    // Lore
    if (srand('lore','rarity') < 1/2) {
      rare.push(
        engine.fn.choose(['Epic','Forgotten','Legendary','Mythical','Retconned'], srand('lore','roll')) + ' lore'
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
    if (srand('period','rarity') < 3/7) {
      rare.push(
        engine.fn.choose(['Ancient period','Extinction period','Timeless'], srand('period','roll'))
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
    add: function (name, state = {}) {
      states.set(name, {...defaultState, ...state})

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
    generateEphemeral: (name) => generate(name),
    generateNameForBody: function (bodyName) {
      const shortName = bodyName.split(' ').slice(-2).join(' ')

      let name

      do {
        const prefix = engine.fn.choose([
          'Accent',
          'Air',
          'Ambiance',
          'Anthem',
          'Aria',
          'Axiom',
          'Ballad',
          'Bark',
          'Beat',
          'Bellow',
          'Blast',
          'Bleat',
          'Breath',
          'Boom',
          'Buzz',
          'Call',
          'Caw',
          'Canon',
          'Chant',
          'Cheer',
          'Chirp',
          'Chortle',
          'Chorus',
          'Coda',
          'Concept',
          'Concert',
          'Cough',
          'Crash',
          'Croak',
          'Cry',
          'Dialogue',
          'Ding',
          'Dirge',
          'Drone',
          'Duet',
          'Echo',
          'Etude',
          'Fermata',
          'Gasp',
          'Growl',
          'Grunt',
          'Harmony',
          'Hiss',
          'Huff',
          'Hum',
          'Hurrah',
          'Huzzah',
          'Hymn',
          'Idea',
          'Idiom',
          'Invocation',
          'Inflection',
          'Jeer',
          'Jingle',
          'Joy',
          'Jubilation',
          'Knell',
          'Laugh',
          'Lullaby',
          'Lyric',
          'March',
          'Mass',
          'Melody',
          'Meow',
          'Mistake',
          'Monologue',
          'Motif',
          'Motto',
          'Nocturne',
          'Noise',
          'Note',
          'Noun',
          'Ode',
          'Opera',
          'Ostinato',
          'Prayer',
          'Prelude',
          'Pride',
          'Proverb',
          'Psalm',
          'Puff',
          'Pulse',
          'Quiver',
          'Rally',
          'Refrain',
          'Requiem',
          'Rhapsody',
          'Rhyme',
          'Rhythm',
          'Riff',
          'Roar',
          'Romance',
          'Scale',
          'Scream',
          'Serenade',
          'Shout',
          'Sigh',
          'Signal',
          'Siren',
          'Snarl',
          'Sneeze',
          'Snort',
          'Soliloquy',
          'Solo',
          'Sonata',
          'Sound',
          'Song',
          'Squall',
          'Symphony',
          'Threnody',
          'Timbre',
          'Tone',
          'Tongue',
          'Trance',
          'Trill',
          'Triumph',
          'Tune',
          'Utterance',
          'Vent',
          'Verse',
          'Vibe',
          'Voice',
          'Waltz',
          'Wail',
          'Warble',
          'Wheeze',
          'Whine',
          'Whoop',
          'Word',
          'Yak',
          'Yawn',
          'Yell',
          'Yowl',
          'Zephyr',
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

      // Apply default states for saves prior to v1.2.0.
      for (const [key, value] of Object.entries(defaultState)) {
        if (!(key in instrument.state)) {
          instrument.state[key] = value
        }
      }

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
    hasScanned: function () {
      for (const [name, state] of states.entries()) {
        if (state.scans) {
          return true
        }
      }

      return false
    },
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
