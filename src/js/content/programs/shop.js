content.programs.shop = content.programs.invent({
  id: 'shop',
  // Particles
  alterParticle: function (particle) {
    particle.target.h = 0
    particle.target.s = 0
    particle.target.v = 1
    particle.target.x = particle.floor.y > -15 ? Math.max(particle.floor.x, -10) : Math.max(particle.floor.x, -20)
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z + (particle.floor.y > -15 ? Math.max(0, Math.abs(particle.floor.x) - 10) : Math.max(0, Math.abs(particle.floor.x) - 20))
  },
})
