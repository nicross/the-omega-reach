content.cellar.tiles.quagmire = content.cellar.tiles.invent({
  id: 'quagmire',
  name: 'The quagmire',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  effectsGlobal: [
    {
      attribute: {
        label: `Deflated donations`,
        modifiers: [],
      }
    },
  ],
  getGlobalDonationRate: () => -1/3,
  onActivate: function () {
    this.zField = engine.fn.createNoise({
      octaves: 3,
      seed: ['quagmire', 'z', this.x, this.y, this.z],
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

    const time = content.time.value(),
      value = this.zField.value(particle.target.x / 10, particle.target.y / 10, time / 10)

    particle.target.z += 1.5 * engine.fn.scale(value, 0, 1, -1, 1) * (distance ** 0.75)
    particle.target.s = (0.5 + (0.5 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]))) ** 0.5
    particle.target.v = (0.5 + (0.5 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]))) ** 1.5
  },
}, content.cellar.tiles.baseUnique)
