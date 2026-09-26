content.cellar.tiles.rift = content.cellar.tiles.invent({
  id: 'rift',
  name: 'The rift',
  category: 'negative',
  uniquePerFloor: true,
  weight: 6,
  onEnterEffects: function () {
    // Health *= 0.5

    if (!content.cellar.health.has(2)) {
      return
    }

    content.cellar.health.set(
      Math.ceil(
        content.cellar.health.amount() * 0.5
      )
    )

    content.audio.healthChange.trigger({isUp: false})

    this.effectsOnEnter.push({
      attribute: {
        label: 'Sanity drained',
        modifiers: [],
      },
    })
  },
  onActivate: function () {
    this.zField = engine.fn.createNoise({
      octaves: 4,
      seed: ['rift', 'z', this.x, this.y, this.z],
      type: 'simplex3d',
    })

    engine.ephemera.add(this.zField)
  },
  onDeactivate: function () {
    engine.ephemera.remove(this.zField)
    delete this.zField
  },
  alterParticle: function (particle) {
    const radius = 10,
      square = 10

    if (Math.abs(particle.target.x) > square || Math.abs(particle.target.y) > square) {
      return
    }

    const distance = 1 - (engine.tool.vector2d.create(particle.target).distance() / radius)

    if (distance < 0) {
      return
    }

    const time = content.time.value()

    const value = this.zField.value(particle.floor.x / 5, particle.floor.y / 30, time / 60)
    const depth = content.fn.gain(value, 2) * (distance ** 0.75)

    particle.target.s = engine.fn.lerpExp(
      0,
      0.75 + (0.25 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1])),
      depth,
      0.333,
    )

    particle.target.v = (1 - depth) ** 2
    particle.target.z -= 5 * depth
  },
}, content.cellar.tiles.baseUnique)
