content.cellar.tiles = (() => {
  const cache = engine.tool.cache2d.create()

  const offLimits = [
    engine.tool.vector2d.create({x: 0, y: 2}), // easter egg (what is the shopkeeper hiding?)
    engine.tool.vector2d.create({x: 0, y: 1}), // shop
    engine.tool.vector2d.create({x: -1, y: 1}), // atrium
    engine.tool.vector2d.create({x: -1, y: 2}), // reach
    engine.tool.vector2d.create({x: -2, y: 1}), // lobby
    engine.tool.vector2d.create({x: -1, y: 0}), // gallery
  ]

  const effectTypes = [
    /*
    Chances
    0.2 - nothing
    0.2 - small donation
    0.2 - damage
    0.15 - heal
    0.1 - big donation
    0.1 - restore
    0.05 - instrument
    */
    // Nothing
    {
      weight: 0.2,
      generate: (srand) => {
        const label = engine.fn.choose([
          'Cracked ceiling',
          'Donation logs',
          'Employee records',
          'Guest ledgers',
          'Large cobwebs',
          'Random detritis',
          'Recipe books',
          'Really nothing',
          'Stacked boxes',
          'Stacked newspapers',
          'Uneven flooring',
          'Vestigial wiring',
        ], srand())

        return {
          apply: () => {},
          attribute: {
            label,
            modifiers: [],
          },
          liveLabel: `${label} found`,
        }
      },
    },
    // Small credits
    {
      weight: 0.2,
      generate: (srand) => {
        const roll = srand()
        const reward = Math.round(engine.fn.lerp(1, 10, roll))
        const label = engine.fn.choose(['Microscopic', 'Meager', 'Modest'], roll)

        return {
          apply: () => {
            content.wallet.add(reward)
          },
          attribute: {
            label: `${label} donation`,
            modifiers: ['rare'],
          },
          liveLabel: `${label} donation found`,
        }
      },
    },
    // Big credits
    {
      weight: 0.1,
      generate: (srand) => {
        const roll = srand()
        const reward = Math.round(engine.fn.lerp(25, 75, roll))
        const label = engine.fn.choose(['Generous', 'Grandiose', 'Gargantuan'], roll)

        return {
          apply: () => {
            content.wallet.add(reward)
          },
          attribute: {
            label: `${label} donation`,
            modifiers: ['rare'],
          },
          liveLabel: `${label} donation found`,
        }
      },
    },
    // Instrument
    {
      weight: 0.05,
      generate: (srand) => {
        return {
          apply: () => {
            content.instruments.add(
              content.cellar.instruments.generateUniqueName()
            )
          },
          attribute: {
            label: `Instrument recovered`,
            modifiers: ['instrument'],
          },
        }
      },
    },
    // Heal
    {
      weight: 0.15,
      generate: (srand) => {
        const label = engine.fn.choose([
          'Astronomical observations',
          'Calm atmosphere',
          'Discarded thesauruses',
          'Dusty encyclopedias',
          'Faded dictionaries',
          'Musical compositions',
          'Smitten kittens',
          'Stellar catalogs',
          'Vintage synthesizers',
          'Vinyl records',
        ], srand())

        return {
          apply: () => {
            content.cellar.health.add(1)
          },
          attribute: {
            label,
            modifiers: ['legendary'],
          },
          liveLabel: `${label} found, gained ${app.utility.format.health(1)}`,
        }
      },
    },
    // Full heal
    {
      weight: 0.1,
      generate: (srand) => {
        const label = engine.fn.choose([
          'Breadcrumb trail',
          'Familiar landmark',
          'Rest area',
          'Water cooler',
        ], srand())

        return {
          apply: () => {
            content.cellar.health.setMax()
          },
          attribute: {
            label,
            modifiers: ['legendary'],
          },
          liveLabel: `${label} found, sanity fully restored`,
        }
      },
    },
    // Damage
    {
      weight: 0.2,
      generate: (srand) => {
        const label = engine.fn.choose([
          'Antimatter residue',
          'Burning odor',
          'Dutch angle',
          'Earthen rodents',
          'Electrical hum',
          'Flickering light',
          'Gravitational blip',
          'Magnetic interference',
          'Mysterious presence',
          'Putrid stench',
          'Research chemicals',
          'Temporal distortion',
        ], srand())

        return {
          apply: () => {
            content.cellar.health.subtract(1)
          },
          attribute: {
            label,
            modifiers: ['legendary'],
          },
          liveLabel: `${label} found, lost ${app.utility.format.health(1)}`,
        }
      },
    },
  ]

  function generate(x, y) {
    const tile = {
      effects : [],
      x,
      y,
    }

    const srand = engine.fn.srand('cellar', content.cellar.run.count(), 'tile', x, y)
    const types = [...effectTypes]

    const count = !x && !y
      ? 0
      : Math.round(engine.fn.lerpExp(0, 2, srand(), 3))

    for (let i = 0; i < count; i += 1) {
      const type = engine.fn.chooseWeighted(types, srand())

      tile.effects.push(
        type.generate(
          engine.fn.srand(
            'cellar', content.cellar.run.count(), 'tile', x, y, 'effect', i
          )
        )
      )

      types.splice(types.indexOf(type), 1)
    }

    return tile
  }

  return {
    current: function () {
      return this.get(
        content.cellar.position.get()
      )
    },
    get: function ({x, y}) {
      if (!cache.has(x, y)) {
        cache.set(x, y, generate(x, y))
      }

      return cache.get(x, y)
    },
    isOffLimits: ({x, y}) => {
      for (let vector of offLimits) {
        if (vector.x == x && vector.y == y) {
          return true
        }
      }

      return false
    },
    reset: function () {
      cache.reset()

      return this
    },
  }
})()
