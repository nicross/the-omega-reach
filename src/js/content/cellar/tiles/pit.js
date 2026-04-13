content.cellar.tiles.pit = content.cellar.tiles.invent({
  id: 'pit',
  alwaysAudible: true,
  isUnique: true,
  name: 'The pit',
  synthType: 'sawtooth',
  uniquePerRun: true,
  weight: 1/12,
  getEffects: function () {
    const effects = [],
      scans = content.cellar.scans.get(this)

    if (scans > 1 || content.cellar.health.has(2)) {
      effects.push({
        apply: () => {
          content.cellar.health.subtract(1)
        },
        attribute: {
          label: 'Sanity drained',
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
    const radius = 10

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius) {
      return
    }

    let vector = engine.tool.vector2d.create(particle.target)
    const distance = 1 - (vector.distance() / radius)

    if (distance < 0) {
      return
    }

    const time = content.time.value()

    vector = vector.rotate(
      engine.const.tau * time * 0.05 * distance
    )

    particle.target.x = vector.x
    particle.target.y = vector.y
    particle.target.z -= distance * 2

    particle.target.v *= 1 - distance
  },
})
