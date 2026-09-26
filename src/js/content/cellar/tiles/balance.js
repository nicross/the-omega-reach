content.cellar.tiles.balance = content.cellar.tiles.invent({
  id: 'balance',
  name: 'The balance',
  category: 'situational',
  uniquePerFloor: true,
  weight: 2,
  calculateTargetHealth: function () {
    const current = content.cellar.health.amount(),
      max = content.cellar.health.max()

    return Math.round(
      engine.fn.scale(current, 1, max, max, 1)
    )
  },
  onEnterEffects: function () {
    // Health = max * (1 - (health / max))

    const health = content.cellar.health.amount(),
      target = this.calculateTargetHealth()

    if (health == target) {
      return
    }

    content.cellar.health.set(target)
    content.audio.healthChange.trigger({isUp: health < target})

    this.effectsOnEnter.push({
      attribute: {
        label: `Sanity ${health < target ? 'recovered' : 'drained'}`,
        modifiers: [],
      },
    })
  },
  alterParticle: function (particle) {
    if (Math.abs(particle.target.x) > 10 || Math.abs(particle.target.y) > 10) {
      return
    }

    const time = content.time.value(),
      value = Math.sin(engine.const.tau * (time * 0.1)) * (particle.target.y / 10)

    particle.target.z += 2 * value
    particle.target.v *= 0.5 * (value + 1)
  },
}, content.cellar.tiles.baseUnique)
