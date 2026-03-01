content.cellar.tiles = (() => {
  const cache = engine.tool.cache2d.create()

  const effectTypes = [
    /*
    0.25 - nothing
    0.2 - small
    0.1 - big
    0.05 - instrument
    0.15 - heal
    0.05 - restore
    0.1875 - damage
    0.0125 - death
    */
    // Nothing
    {
      weight: 0.25,
      generate: (srand) => {
        const label = engine.fn.choose([
          'Antimatter residue',
          'Breadcrumb trail',
          'Burning smell',
          'Cracked ceiling',
          'Discarded thesauruses',
          'Dusty encyclopedias',
          'Gravitational anomaly',
          'Large cobwebs',
          'Putrid stench',
          'Random detritis',
          'Rusty equipment',
          'Stacked boxes',
          'Uneven flooring',
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
        const reward = Math.round(srand(1, 10))

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
      weight: 0.05,
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
      weight: 0.1875,
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
      weight: 0.0125,
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
    reset: function () {
      cache.reset()

      return this
    },
  }
})()
