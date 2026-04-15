content.cellar.tiles.ziggurat = content.cellar.tiles.invent({
  id: 'ziggurat',
  alwaysAudible: true,
  isUnique: true,
  name: 'The ziggurat',
  uniquePerRun: true,
  weight: 1/12,
  defaultState: {
    delta: 0,
  },
  getEffects: function () {
    const effects = [],
      health = content.cellar.health.amount(),
      midpoint = Math.ceil(content.cellar.health.max() * 0.5),
      scans = content.cellar.scans.get(this)

    if (scans > 1 || health != midpoint) {
      effects.push({
        apply: () => {
          if (health > midpoint) {
            content.cellar.health.subtract(1)
            content.audio.sanityChange.trigger({isUp: false})
            this.state.delta = -1
          } else if (health < midpoint) {
            content.cellar.health.add(1)
            content.audio.sanityChange.trigger({isUp: true})
            this.state.delta = 1
          }
        },
        attribute: {
          label: `Sanity ${health > midpoint ? 'drained' : 'restored'}`,
          modifiers: [],
        },
      })
    } else {
      this.state.delta = 0
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
    const radius = 6
    const max = radius / Math.sqrt(2)

    if (engine.fn.distance({x: particle.target.x, y: particle.target.y}) > radius + 0.5) {
      return
    }

    let vector = engine.tool.vector2d.create(particle.target)
    const time = content.time.value()

    vector = vector.rotate(
      engine.const.tau * time * 0.025 * this.state.delta
    )

    const distance = 1 - engine.fn.clamp(Math.max(Math.abs(vector.x), Math.abs(vector.y)) / max),
      steps = 5

    if (distance > 0) {
      particle.target.v = 0.6 + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]) * 0.25)
    }

    if (distance == 0 || distance >= (steps - 1) / steps) {
      particle.target.s = 0.166 + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]) * 0.166)
    }

    particle.target.z += Math.ceil(distance * steps) / steps * 4
  },
})
