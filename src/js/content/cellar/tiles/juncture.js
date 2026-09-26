content.cellar.tiles.juncture = content.cellar.tiles.invent({
  id: 'juncture',
  name: 'The juncture',
  category: 'positive',
  uniquePerFloor: true,
  weight: 6,
  onEnterEffects: function () {
    // Health *= 1.5

    if (content.cellar.health.isMax()) {
      return
    }

    content.cellar.health.set(
      Math.round(
        content.cellar.health.amount() * 1.5
      )
    )

    content.audio.healthChange.trigger({isUp: true})

    this.effectsOnEnter.push({
      attribute: {
        label: 'Sanity recovered',
        modifiers: [],
      },
    })
  },
  alterParticle: function (particle) {
    const radius = 10

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius) {
      return
    }

    let vector = engine.tool.vector2d.create(particle.target)

    if (vector.distance() > radius) {
      return
    }

    const midpoint = vector.scale(0.5),
      time = content.time.value()

    const rotation = engine.const.tau * time/30 * particle.twinkleFrequencies[0] * (particle.value > 0.5 ? 1 : -1)

    vector = vector.subtract(midpoint)
      .rotate(rotation)
      .add(midpoint)

    particle.target.s = engine.fn.lerpExp(
      0.75 + (0.25 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1])),
      0,
      vector.distance() / radius,
      0.75,
    )

    particle.target.x = vector.x
    particle.target.y = vector.y
    particle.target.z += Math.sin(rotation) * 1
  },
}, content.cellar.tiles.baseUnique)
