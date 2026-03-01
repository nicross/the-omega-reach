content.programs.lobby = content.programs.invent({
  id: 'lobby',
  fieldDefinitions: {
    flicker: {type: '1d'},
  },
  // Synthesis
  invertSynthX: function () {
    return !content.solution.has()
  },
  // Particles
  alterParticle: function (particle) {
    const isOnline = content.rooms.reach.state.online,
      time = content.time.value()

    particle.target.h = engine.fn.lerp(-25, 25, content.fn.gain(this.fields.flicker.valueAt({x: time}, 6), 1.5)) / 360
    particle.target.s = 0
    particle.target.v = 1
    particle.target.x = Math.max(particle.floor.x, particle.floor.y < 10 ? -10 : -20)
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z + (particle.floor.y < 10 ? Math.max(0, Math.abs(particle.floor.x) - 10) : Math.max(0, Math.abs(particle.floor.x) - 20))

    if (particle.floor.y > 10 && particle.floor.x <= -20) {
      particle.target.h = isOnline ? particle.target.h : engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, -1/2, -1/4)
      particle.target.s = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]), -1, 1, 0.333, 1)
      particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)
      particle.target.z = particle.target.z - particle.floor.z + engine.fn.wrap(particle.target.z - (time * 0.333), particle.floor.z, particle.target.z)
    }
  },
  // Rumble
  useNavigationalRumble: () => true,
})
