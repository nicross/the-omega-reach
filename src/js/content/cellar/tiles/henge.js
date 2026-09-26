content.cellar.tiles.henge = content.cellar.tiles.invent({
  id: 'henge',
  name: 'The henge',
  category: 'positive',
  uniquePerFloor: true,
  weight: 8,
  onEnterEffects: function () {
    if (content.cellar.health.has(4)) {
      return
    }

    content.cellar.health.set(4)
    content.audio.healthChange.trigger({isUp: true})

    this.effectsOnEnter.push({
      attribute: {
        label: 'Sanity recovered',
        modifiers: [],
      },
    })
  },
  alterParticle: function (particle) {
    const radius = 2.5

    if (Math.abs(particle.target.x) > 10 || Math.abs(particle.target.y) > 10) {
      return
    }

    const distances = [
      engine.tool.vector2d.unitX().scale(7.5).rotate(engine.const.tau * (2/7)).distance(particle.target),
      engine.tool.vector2d.unitX().scale(7.5).rotate(engine.const.tau * (3/7)).distance(particle.target),
      engine.tool.vector2d.unitX().scale(7.5).rotate(engine.const.tau * (4/7)).distance(particle.target),
      engine.tool.vector2d.unitX().scale(7.5).rotate(engine.const.tau * (5/7)).distance(particle.target),
    ]

    const closest = Math.min(...distances)

    if (closest > radius) {
      return
    }

    const closestIndex = distances.indexOf(closest),
      distance = 1 - (Math.min(closest) / radius),
      time = content.time.value(),
      value = content.fn.gain(engine.fn.scale(Math.sin(engine.const.tau * ((time * 0.1) + closestIndex/7)), -1, 1, 0, 1), 2)

    particle.target.z += 5 * content.fn.gain(distance, 2) * value
    particle.target.h = 2/5 + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]) * 1/10)
    particle.target.s = engine.fn.lerpExp(0, 2/3 + Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1])/6, value, 0.5)
    particle.target.v = engine.fn.lerpExp(1, 1/2 + Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2])/4, value, 0.5)
  },
}, content.cellar.tiles.baseUnique)
