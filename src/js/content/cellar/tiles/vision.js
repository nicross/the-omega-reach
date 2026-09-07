content.cellar.tiles.vision = content.cellar.tiles.invent({
  id: 'vision',
  name: 'The vision',
  category: 'special',
  uniquePerRun: true,
  weight: 1,
  defaultState: {
    entered: false,
  },
  effectsGlobal: [
    {
      attribute: {
        label: `Weakened sanity`,
        modifiers: [],
      }
    },
  ],
  getGlobalHealthBonus: () => -3,
  onEnterEffects: function () {
    if (this.state.entered) {
      return
    }

    const health = content.cellar.health.amount()
    const target = Math.max(1, health - this.getGlobalHealthBonus())

    if (health > target) {
      content.cellar.health.set(target)
      content.audio.sanityChange.trigger({isUp: false})
    }

    this.state.entered = true
  },
  alterParticle: function (particle) {
    const radius = 7.5

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius) {
      return
    }

    const time = content.time.value()
    const value = 0.5 + (0.5 * Math.sin(engine.const.tau * time/30 * particle.twinkleFrequencies[0]))

    particle.target.x = engine.fn.lerpExp(particle.floor.x, 0, value, 3)
    particle.target.y = engine.fn.lerpExp(particle.floor.y, 0, value, 3)
    particle.target.z = engine.fn.lerpExp(particle.floor.z, 2, value, 1)

    particle.target.s = engine.fn.lerpExp(
      0,
      0.5 + (0.5 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0])),
      value,
      0.5,
    )

    particle.target.v = engine.fn.lerpExp(
      1,
      0.5 + (0.5 * Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0])),
      value,
      0.5,
    )
  },
}, content.cellar.tiles.baseUnique)
