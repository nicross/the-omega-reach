content.cellar.tiles.obelisk = content.cellar.tiles.invent({
  id: 'obelisk',
  name: 'The obelisk',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  defaultState: {
    entered: false,
    rotation: 0,
  },
  effectsGlobal: [
    {
      attribute: {
        label: `Hardened sanity`,
        modifiers: [],
      }
    },
  ],
  getGlobalHealthBonus: () => 5,
  onEnterEffects: function () {
    this.state.rotation = this.state.rotation
      ? this.state.rotation * -1
      : engine.fn.randomSign()

    if (this.state.entered) {
      return
    }

    content.cellar.health.add(this.getGlobalHealthBonus())
    content.audio.sanityChange.trigger({isUp: true})

    this.state.entered = true
  },
  alterParticle: function (particle) {
    const radius = 5

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius) {
      return
    }

    // Convert to edges of a rectangular prism
    const square = radius / Math.sqrt(2),
      square2 = square / 1.618,
      time = content.time.value()

    let vector = engine.tool.vector2d.create({
      x: engine.fn.closer(particle.target.x, -square, square),
      y: engine.fn.closer(particle.target.y, -square2, square2),
    })

    particle.target.s = engine.fn.lerp(
      // Full color
      1,
      // Twinkling white
      0.5 + (0.5 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1])),
      // Alternating oscillating columns
      0.5 + (0.5 * Math.sin(Math.sign(vector.x * vector.y) * engine.const.tau * (time/6 + particle.value*3)))
    )

    // Rotate clockwise
    vector = vector.rotate(this.state.rotation * engine.const.tau * time / 120)

    const value = (0.5 + (0.5 * Math.sin(engine.const.tau * time/10 * particle.twinkleFrequencies[2]))) ** 4

    particle.target.x = engine.fn.lerp(vector.x, particle.floor.x, value)
    particle.target.y = engine.fn.lerp(vector.y, particle.floor.y, value)
    particle.target.z += engine.fn.lerp(-5, 10, particle.value)
  },
}, content.cellar.tiles.baseUnique)
