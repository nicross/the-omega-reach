content.programs.atrium = content.programs.invent({
  id: 'atrium',
  fieldDefinitions: {
    flicker: {type: '1d'},
  },
  // Particles
  alterParticle: function (particle) {
    const isOnline = content.rooms.reach.state.online,
      time = content.time.value()

    particle.target.h = engine.fn.lerp(-25, 25, content.fn.gain(this.fields.flicker.valueAt({x: time}, 6), 1.5)) / 360
    particle.target.s = isOnline && Math.abs(particle.floor.y) < 5 ? engine.fn.clamp(engine.fn.scale(particle.floor.x, -40, 10, 1, 0)) ** 1 : 0
    particle.target.v = 1
    particle.target.x = Math.abs(particle.floor.y) > 5 ? Math.max(particle.floor.x, -20) : particle.floor.x
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z + (
      Math.abs(particle.floor.y) > 5
        ? Math.max(0, Math.abs(particle.floor.x) - 20)
        : 0
    )

    if (particle.target.z > particle.floor.z) {
      particle.target.h = isOnline ? particle.target.h : engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, -1/2, -1/4)
      particle.target.s = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]), -1, 1, 0, isOnline ? 1 : 0.666)
      particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)
      particle.target.z = particle.target.z - particle.floor.z + engine.fn.wrap(particle.target.z - (time * 0.333), particle.floor.z, particle.target.z)
    }
  },
})
