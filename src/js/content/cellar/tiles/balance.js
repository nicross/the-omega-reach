content.cellar.tiles.balance = content.cellar.tiles.invent({
  id: 'balance',
  alwaysAudible: true,
  isUnique: true,
  name: 'The balance',
  uniquePerRun: true,
  weight: 1/12,
  calculateTargetHealth: function () {
    const current = content.cellar.health.amount(),
      max = content.cellar.health.max()

    return Math.round(
      engine.fn.scale(current, 1, max, max, 1)
    )
  },
  getEffects: function () {
    const effects = [],
      health = content.cellar.health.amount(),
      scans = content.cellar.scans.get(this),
      target = this.calculateTargetHealth()

    if (scans > 1 || health != target) {
      effects.push({
        apply: () => {
          content.cellar.health.set(target)
          content.audio.sanityChange.trigger({isUp: health < target})
        },
        attribute: {
          label: 'Sanity inverted',
          modifiers: [],
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
  alterParticle: function (particle) {
    if (Math.abs(particle.target.x) > 10 || Math.abs(particle.target.y) > 10) {
      return
    }

    const time = content.time.value(),
      value = Math.sin(engine.const.tau * (time * 0.1)) * (particle.target.y / 10)

    particle.target.z += 2 * value
    particle.target.v *= 0.5 * (value + 1)
  },
})
