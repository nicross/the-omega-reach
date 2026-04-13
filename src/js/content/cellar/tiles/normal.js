content.cellar.tiles.normal = (() => {
  const effectTypes = [
    /*
    Chances
    0.3 - damage
    0.2 - nothing
    0.15 - small donation
    0.125 - heal
    0.1 - big donation
    0.075 - restore
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
      weight: 0.15,
      generate: (srand) => {
        const roll = srand()
        const reward = Math.round(engine.fn.lerp(1, 3, roll))
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
        const reward = Math.round(engine.fn.lerp(3, 5, roll))
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
      weight: 0.125,
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
            content.audio.sanityChange.trigger({isUp: true})
          },
          attribute: {
            label,
            modifiers: [],
          },
          liveLabel: `${label} found, gained ${app.utility.format.health(1)}`,
        }
      },
    },
    // Full heal
    {
      weight: 0.075,
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
            content.audio.sanityChange.trigger({isUp: true})
          },
          attribute: {
            label,
            modifiers: [],
          },
          liveLabel: `${label} found, sanity fully restored`,
        }
      },
    },
    // Damage
    {
      weight: 0.3,
      generate: (srand) => {
        const label = engine.fn.choose([
          'Antimatter residue',
          'Burning odor',
          'Dutch angle',
          'Earthen rodents',
          'Electrical hum',
          'Flickering light',
          'Infrasonic drone',
          'Gravitational blip',
          'Magnetic interference',
          'Mysterious presence',
          'Ominous footprints',
          'Putrid stench',
          'Research chemicals',
          'Temporal distortion',
        ], srand())

        return {
          apply: () => {
            content.cellar.health.subtract(1)
            content.audio.sanityChange.trigger({isUp: false})
          },
          attribute: {
            label,
            modifiers: [],
          },
          liveLabel: `${label} found, lost ${app.utility.format.health(1)}`,
        }
      },
    },
  ]

  return content.cellar.tiles.invent({
    id: 'normal',
    generate: function (tile) {
      const srand = engine.fn.srand(...tile.seed, 'effects')
      const types = [...effectTypes]

      const count = !tile.x && !tile.y
        ? 0
        : Math.round(engine.fn.lerpExp(0, 2, srand(), 3))

      for (let i = 0; i < count; i += 1) {
        const type = engine.fn.chooseWeighted(types, srand())

        tile.effects.push(
          type.generate(
            engine.fn.srand(...tile.seed, 'effect', i)
          )
        )

        types.splice(types.indexOf(type), 1)
      }

      return this.extend(tile)
    },
  })
})()
