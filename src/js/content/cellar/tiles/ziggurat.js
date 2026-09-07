content.cellar.tiles.ziggurat = content.cellar.tiles.invent({
  id: 'ziggurat',
  name: 'The ziggurat',
  category: 'situational',
  uniquePerFloor: true,
  weight: 2,
  defaultState: {
    delta: 0,
  },
  onEnterEffects: function () {
    // Health trends toward 50% max

    const health = content.cellar.health.amount(),
      midpoint = Math.ceil(content.cellar.health.max() * 0.5)

    this.state.delta = 0

    if (health == midpoint) {
      return
    }

    if (health > midpoint) {
      this.state.delta = -1

      content.cellar.health.subtract(1)
      content.audio.sanityChange.trigger({isUp: false})

      this.effectsOnEnter.push({
        attribute: {
          label: `Sanity drained`,
          modifiers: [],
        },
      })
    } else if (health < midpoint) {
      this.state.delta = 1

      content.cellar.health.add(1)
      content.audio.sanityChange.trigger({isUp: true})

      this.effectsOnEnter.push({
        attribute: {
          label: `Sanity recovered`,
          modifiers: [],
        },
      })
    }
  },
  alterParticle: function (particle) {
    const radius = 8
    const max = radius / Math.sqrt(2)

    if (engine.fn.distance({x: particle.target.x, y: particle.target.y}) > radius + 0.5) {
      return
    }

    let vector = engine.tool.vector2d.create(particle.target)
    const time = content.time.value()

    vector = vector.rotate(
      engine.const.tau * time * 0.025 * this.state.delta
    ).rotate(
      engine.const.tau / 8
    )

    const distance = 1 - engine.fn.clamp(Math.max(Math.abs(vector.x), Math.abs(vector.y)) / max),
      height = 4,
      steps = 4

    if (distance > 0) {
      particle.target.v = 0.6 + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]) * 0.25)
    }

    if (distance == 0 || distance >= (steps - 1.5) / steps) {
      particle.target.s = 0.666 + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]) * 0.333)
    }

    particle.target.z += height * Math.ceil(distance * steps) / steps
  },
}, content.cellar.tiles.baseUnique)
