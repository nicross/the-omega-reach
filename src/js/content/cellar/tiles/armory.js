content.cellar.tiles.armory = content.cellar.tiles.invent({
  id: 'armory',
  name: 'The armory',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  defaultState: {
    entered: false,
  },
  onEnterEffects: function () {
    if (this.state.entered) {
      return
    }

    content.cellar.barrier.add(3)
    content.audio.barrierChange.trigger({isUp: true})

    this.effectsOnEnter.push({
      attribute: {
        label: 'Greed increased',
        modifiers: ['barrier'],
      },
    })

    this.state.entered = true
  },
  alterParticle: function (particle) {
    const radius = 10,
      square = 10

    if (Math.abs(particle.target.x) > square || Math.abs(particle.target.y) > square) {
      return
    }

    const dx = Math.abs(particle.target.x),
      dy = Math.abs(particle.target.y)

    const z = Math.min(
      engine.fn.clamp(engine.fn.scale(dx, 2.5, 4, 0, 1)),
      engine.fn.clamp(engine.fn.scale(dx, 6, 7.5, 1, 0)),
    ) * Math.min(
      engine.fn.clamp(engine.fn.scale(dy, 2, 2.5, 0, 1)),
      engine.fn.clamp(engine.fn.scale(dy, 7.5, 8, 1, 0)),
    )

    particle.target.z += z * 2

    if (z > 0 && z < 1 && engine.fn.between(dy, 2.5, 7.5)) {
      const time = content.time.value()

      particle.target.h = Math.sin(engine.const.tau * time / 60 * particle.twinkleFrequencies[1])
      particle.target.s = 3/4 + (1/4 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]))
      particle.target.v = 3/4 + (1/4 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]))
    }
  },
}, content.cellar.tiles.baseUnique)
