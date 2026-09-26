content.cellar.tiles.median = content.cellar.tiles.invent({
  id: 'median',
  name: 'The median',
  category: 'situational',
  uniquePerFloor: true,
  weight: 2,
  defaultState: {
    delta: 0,
  },
  onEnterEffects: function () {
    // Health set to 50% max

    const health = content.cellar.health.amount(),
      target = Math.ceil(content.cellar.health.max() * 0.5)

    this.state.delta = 0

    if (health == target) {
      return
    }

    content.cellar.health.set(target)
    content.audio.healthChange.trigger({isUp: health < target})

    this.state.delta = health < target ? -1 : 1

    this.effectsOnEnter.push({
      attribute: {
        label: `Sanity ${health < target ? 'recovered' : 'drained'}`,
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

    const time = content.time.value()
    const width = 1.25 + (1.25 * Math.sin(engine.const.tau * time/37))
    const onPath = engine.fn.between(vector.x, -width, width) || engine.fn.between(vector.y, -width, width)

    particle.target.s = onPath ? 0 : 0.75 + (0.25 * Math.sin(engine.const.tau * particle.twinkleFrequencies[1]))
    particle.target.v = onPath ? 1 : 1/3 + (1/3 * Math.sin(engine.const.tau * particle.twinkleFrequencies[0]))

    vector = vector.rotate(this.state.delta * engine.const.tau * time/120)

    particle.target.x = vector.x
    particle.target.y = vector.y
    particle.target.z += onPath ? 0 : -1
  },
}, content.cellar.tiles.baseUnique)
