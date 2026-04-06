content.programs.stockroomEmpty = content.programs.invent({
  id: 'stockroomEmpty',
  // Particles
  alterParticle: function (particle) {
    particle.target.h = 0
    particle.target.s = 0
    particle.target.v = 1
    particle.target.x = Math.max(particle.floor.x, -10)
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z + Math.max(0, -particle.floor.x - 10)
  },
})
