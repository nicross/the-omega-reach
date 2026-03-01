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
    0.075 - restore
    0.05 - instrument
    0.025 - death
    */
    // Nothing
    {
      weight: 0.2,
      generate: (srand) => {
        const label = engine.fn.choose([
          'Antimatter residue',
          'Breadcrumb trail',
          'Burning odor',
          'Cracked ceiling',
          'Discarded thesauruses',
          'Dusty encyclopedias',
          'Earthen rodents',
          'Electric hum',
          'Experimental decor',
          'Gravitational blip',
          'Guest books',
          'Large cobwebs',
          'Magnetic interference',
          'Mysterious presence',
          'Putrid stench',
          'Quiet air',
          'Random detritis',
          'Really nothing',
          'Recipe books',
          'Research chemicals',
          'Smitten kitten',
          'Stacked boxes',
          'Uneven flooring',
          'Vestigial wiring',
          'Vintage synthesizers',
          'Vinyl records',
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
        const reward = Math.round(srand(5, 15))

        return {
          apply: () => {
            content.wallet.add(reward)
          },
          attribute: {
            label: `Modest donation`,
            modifiers: ['rare'],
          },
          liveLabel: `Modest donation found`,
        }
      },
    },
    // Big credits
    {
      weight: 0.1,
      generate: (srand) => {
        const reward = Math.round(srand(25, 75))

        return {
          apply: () => {
            content.wallet.add(reward)
          },
          attribute: {
            label: `Generous donation`,
            modifiers: ['rare'],
          },
          liveLabel: `Generous donation found`,
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
        return {
          apply: () => {
            content.cellar.health.add(1)
          },
          attribute: {
            label: `Sanity well`,
            modifiers: ['legendary'],
          },
          liveLabel: `Gained ${app.utility.format.health(1)}`,
        }
      },
    },
    // Full heal
    {
      weight: 0.075,
      generate: (srand) => {
        return {
          apply: () => {
            content.cellar.health.setMax()
          },
          attribute: {
            label: `Sanity fountain`,
            modifiers: ['legendary'],
          },
          liveLabel: `Sanity fully restored`,
        }
      },
    },
    // Damage
    {
      weight: 0.2,
      generate: (srand) => {
        return {
          apply: () => {
            content.cellar.health.subtract(1)
          },
          attribute: {
            label: `Sanity sink`,
            modifiers: ['legendary'],
          },
          liveLabel: `Lost ${app.utility.format.health(1)}`,
        }
      },
    },
    // Death
    {
      weight: 0.025,
      generate: (srand) => {
        return {
          apply: () => {
            content.cellar.health.subtract(
              content.cellar.health.amount()
            )
          },
          attribute: {
            label: `Sanity devourer`,
            modifiers: ['legendary'],
          },
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
