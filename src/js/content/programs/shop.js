content.programs.shop = content.programs.invent({
  id: 'shop',
  fieldDefinitions: {
    flicker: {type: '1d'},
  },
  // Particles
  alterParticle: function (particle) {
    const isCellar = engine.fn.between(particle.floor.y, 10, 15) && content.cellar.isOpen(),
      isOnline = content.rooms.reach.state.online,
      time = content.time.value()

    let countertop = 0

    if (particle.floor.x < -10) {
      countertop = Math.max(0, -particle.floor.x - 10)
    } else if (engine.fn.between(particle.floor.x, -7.5, -2.5) && !isCellar) {
      countertop = 1
    }

    particle.target.h = engine.fn.lerp(-25, 25, content.fn.gain(this.fields.flicker.valueAt({x: time}, 6), 1.5)) / 360
    particle.target.s = 0
    particle.target.v = 1
    particle.target.x = isCellar ? particle.floor.x : Math.max(particle.floor.x, particle.floor.y > -10 ? -10 : -20)
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z + (particle.floor.y > -10 ? countertop : Math.max(0, -particle.floor.x - 20))

    if (isCellar) {
      particle.target.z = particle.floor.z
    }

    if (particle.floor.y < -10 && particle.floor.x <= -20) {
      particle.target.h = isOnline ? particle.target.h : engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, -1/2, -1/4)
      particle.target.s = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]), -1, 1, 0, isOnline ? 1 : 0.5)
      particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)
      particle.target.z = particle.target.z - particle.floor.z + engine.fn.wrap(particle.target.z - (time * 0.333), particle.floor.z, particle.target.z)
    }
  },
})
