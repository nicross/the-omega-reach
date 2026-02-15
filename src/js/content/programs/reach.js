content.programs.reach = content.programs.invent({
  id: 'reach',
  onLoad: function () {
    content.sphereIndex.randomize()
    return this
  },
  // Particles
  alterParticle: function (particle) {
    const index = content.sphereIndex.get(),
      isOnline = content.rooms.reach.state.online,
      time = content.time.value()

    const distance = engine.fn.distance({
      x: particle.floor.x,
      y: particle.floor.y,
    })

    const distanceFactor = engine.fn.clamp(
      engine.fn.scale(distance, 0, 4, 2, 0),
      0, 1
    ) * 1.5

    particle.target.h = (0 + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]) * 25)) / 360
    particle.target.s = isOnline ? 0.875 + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]) * 0.125) : 0
    particle.target.v = isOnline ? engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1) : 1
    particle.target.x = isOnline ? particle.spheres[index].x : Math.max(particle.floor.x, -10)
    particle.target.y = isOnline ? particle.spheres[index].y : particle.floor.y
    particle.target.z = isOnline ? particle.spheres[index].z : (particle.floor.z + Math.max(0, -particle.floor.x - 10) + distanceFactor)
  },
})
