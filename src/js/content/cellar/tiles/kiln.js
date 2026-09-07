content.cellar.tiles.kiln = content.cellar.tiles.invent({
  id: 'kiln',
  name: 'The kiln',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  defaultState: {
    entered: false,
    exited: false,
  },
  effectsGlobal: [
    {
      attribute: {
        label: 'Instrument recovered',
        modifiers: ['instrument'],
      },
    },
  ],
  onEnterEffects: function () {
    if (this.state.entered) {
      return
    }

    content.instruments.add(
      content.cellar.instruments.generateUniqueName()
    )

    content.audio.interactSuccess.trigger({index: 2})

    this.state.entered = true
  },
  onExitEffects: function () {
    this.state.exited = true
  },
  alterParticle: function (particle) {
    const height = 2,
      radius = 7.5,
      square = 10

    if (Math.abs(particle.target.x) > square || Math.abs(particle.target.y) > square) {
      return
    }

    const distance = 1 - (engine.tool.vector2d.create(particle.target).distance() / radius)

    if (distance < 0) {
      return
    }

    const time = content.time.value(),
      value = 0.5 + (0.5 * Math.sin(engine.const.tau * time/11 * particle.twinkleFrequencies[1]))

    const vector = engine.tool.vector2d.create(particle.floor)
      .scale(value)

    particle.target.h = engine.fn.lerpExp(1/3 * particle.value, 0, value, 0.5)
    particle.target.s = (3/4 + (1/4 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2])))
    particle.target.v = (1 - value) ** 0.25
    particle.target.x = vector.x
    particle.target.y = vector.y
    particle.target.z += -1 + (height * (value ** 4))
  },
}, content.cellar.tiles.baseUnique)
