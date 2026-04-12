content.cellar.tiles.henge = content.cellar.tiles.invent({
  id: 'henge',
  alwaysAudible: true,
  isUnique: true,
  name: 'The henge',
  synthType: 'sawtooth',
  uniquePerRun: true,
  weight: 1/16,
  getEffects: function () {
    const effects = [],
      scans = content.cellar.scans.get(this)

    if (scans > 1 || !content.cellar.health.has(4)) {
      effects.push({
        apply: () => {
          content.cellar.health.set(4)
        },
        attribute: {
          label: 'Sanity restored',
          modifiers: ['legendary'],
        },
      })
    }

    effects.push({
      apply: () => {},
      attribute: {
        label: 'Nexus of power',
        modifiers: ['legendary'],
      },
    })

    return effects
  },
  onEnter: function () {
    const effects = this.getEffects()

    for (const effect of effects) {
      effect.apply()
    }

    content.cellar.scans.set(this, effects.length)
  },
  onExit: function () {
    content.cellar.scans.set(this, 0)
  },
})
