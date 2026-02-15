content.programs.horizon = content.programs.invent({
  id: 'horizon',
  onLoad: function () {
    content.sphereIndex.randomize()

    return this
  },
  // Particles
  alterParticle: function (particle) {
    const index = content.sphereIndex.get(),
      time = content.time.value()

    particle.target.h = (0 + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]) * 90)) / 360
    particle.target.s = 0.5 + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]) * 0.5)
    particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)
    particle.target.x = -Math.abs(particle.spheres[index].x) * 10
    particle.target.y = particle.spheres[index].y * 10
    particle.target.z = particle.spheres[index].z * 10
  },
})
