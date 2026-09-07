content.cellar.tiles.trove = content.cellar.tiles.invent({
  id: 'trove',
  name: 'The trove',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  effectsGlobal: [
    {
      attribute: {
        label: `Inflated donations`,
        modifiers: [],
      }
    },
  ],
  getGlobalDonationRate: () => 2/3,
  onActivate: function () {
    this.zField = engine.fn.createNoise({
      octaves: 3,
      seed: ['trove', 'z', this.x, this.y, this.z],
      type: 'simplex2d',
    })

    engine.ephemera.add(this.zField)
  },
  onDeactivate: function () {
    engine.ephemera.remove(this.zField)
    delete this.zField
  },
  alterParticle: function (particle) {
    const radius = 4,
      square = 10

    if (Math.abs(particle.target.x) > square || Math.abs(particle.target.y) > square) {
      return
    }

    const distances = [
      engine.tool.vector2d.unitX().scale(square - radius).rotate(engine.const.tau * (1/8)).distance(particle.target),
      engine.tool.vector2d.unitX().scale(square - radius).rotate(engine.const.tau * (3/8)).distance(particle.target),
      engine.tool.vector2d.unitX().scale(square - radius).rotate(engine.const.tau * (5/8)).distance(particle.target),
      engine.tool.vector2d.unitX().scale(square - radius).rotate(engine.const.tau * (7/8)).distance(particle.target),
    ]

    const closest = Math.min(...distances)

    if (closest > radius) {
      return
    }

    const distance = 1 - (Math.min(closest) / radius),
      time = content.time.value(),
      value = this.zField.value(particle.target.x / 10, particle.target.y / 10)

    particle.target.z += 2.5 * content.fn.gain(distance, 2) * value
    particle.target.h = Math.sin(engine.const.tau * time / 60 * particle.twinkleFrequencies[2])
    particle.target.s = engine.fn.lerpExp(0, 3/4 + Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0])/4, value, 0.5)
    particle.target.v = engine.fn.lerpExp(1, 3/4 + Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1])/4, value, 0.5)
  },
}, content.cellar.tiles.baseUnique)
