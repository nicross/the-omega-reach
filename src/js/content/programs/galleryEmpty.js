content.programs.galleryEmpty = content.programs.invent({
  id: 'galleryEmpty',
  // Synthesis
  invertSynthX: function () {
    return !content.solution.has()
  },
  // Particles
  alterParticle: function (particle) {
    particle.target.h = 0
    particle.target.s = 0
    particle.target.v = 1
    particle.target.x = particle.floor.x
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z
  },
  // Rumble
  useNavigationalRumble: () => true,
})
