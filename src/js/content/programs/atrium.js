content.programs.atrium = content.programs.invent({
  id: 'atrium',
  // Particles
  alterParticle: function (particle) {
    const isOnline = content.rooms.reach.state.online,
      time = content.time.value()

    particle.target.h = (Math.sin(engine.const.tau * time / 16) * 25) / 360
    particle.target.s = isOnline && Math.abs(particle.floor.y) < 5 ? engine.fn.clamp(engine.fn.scale(particle.floor.x, -40, 10, 1, 0)) ** 1 : 0
    particle.target.v = 1
    particle.target.x = Math.abs(particle.floor.y) > 5 ? Math.max(particle.floor.x, -20) : particle.floor.x
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z + (Math.abs(particle.floor.y) > 5 ? Math.max(0, Math.abs(particle.floor.x) - 20) : 0)
  },
})
