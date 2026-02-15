content.programs.atrium = content.programs.invent({
  id: 'atrium',
  // Particles
  alterParticle: function (particle) {
    particle.target.h = 0
    particle.target.s = 0
    particle.target.v = 1
    particle.target.x = Math.abs(particle.floor.y) > 5 ? Math.max(particle.floor.x, -20) : particle.floor.x
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z + (Math.abs(particle.floor.y) > 5 ? Math.max(0, Math.abs(particle.floor.x) - 20) : 0)
  },
})
