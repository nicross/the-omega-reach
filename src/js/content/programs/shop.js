content.programs.shop = content.programs.invent({
  id: 'shop',
  // Particles
  alterParticle: function (particle) {
    let countertop = 0

    if (particle.floor.x < -10) {
      countertop = Math.max(0, -particle.floor.x - 15)
    } else if (particle.floor.x < -5) {
      countertop = 1.5
    }

    particle.target.h = 0
    particle.target.s = 0
    particle.target.v = 1
    particle.target.x = Math.max(particle.floor.x, -20)
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z + (particle.floor.y > -10 ? countertop : Math.max(0, -particle.floor.x - 20))
  },
})
