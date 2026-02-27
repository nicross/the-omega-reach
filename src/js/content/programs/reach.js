content.programs.reach = content.programs.invent({
  id: 'reach',
  propertyDefinitions: {
    rotation: () => engine.tool.quaternion.identity(),
  },
  onLoad: function () {
    content.sphereIndex.randomize()
    return this
  },
  onUpdate: function () {
    if (content.rooms.reach.state.online) {
      if (!this.properties.rotationVelocity) {
        const primes = [2,3,5,7]
        this.properties.rotationVelocity = engine.tool.quaternion.fromEuler({
          pitch: engine.fn.randomSign() * engine.fn.chooseSplice(primes, Math.random()),
          roll: engine.fn.randomSign() * engine.fn.chooseSplice(primes, Math.random()),
          yaw: engine.fn.randomSign() * engine.fn.chooseSplice(primes, Math.random()),
        }).normalize()
      }

      this.properties.rotation = this.properties.rotation.multiply(
        this.properties.rotationVelocity.lerpFrom({}, engine.loop.delta() / 5)
      ).normalize()
    } else {
      this.properties.rotation = engine.tool.quaternion.identity()
      this.properties.rotationVelocity = undefined
    }
  },
  onExit: function () {
    this.properties.rotationVelocity = undefined
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
    )

    particle.target.h = engine.fn.lerpExp(-25, 25, engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, 0, 1), 4) / 360
    particle.target.s = isOnline ? 0.875 + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]) * 0.125) : 0
    particle.target.v = isOnline ? engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1) : engine.fn.lerpExp(1, 0.25, distanceFactor, 0.05)
    particle.target.x = isOnline ? engine.fn.clamp(particle.spheres[index].x, -0.5, 0.5) * 2 : Math.max(particle.floor.x, -10)
    particle.target.y = isOnline ? engine.fn.clamp(particle.spheres[index].y, -0.5, 0.5) * 2 : particle.floor.y
    particle.target.z = isOnline ? engine.fn.clamp(particle.spheres[index].z, -0.5, 0.5) * 2 : (particle.floor.z + Math.max(0, -particle.floor.x - 10) + (distanceFactor * 2))
  },
  getRotation: function () {
    return content.rooms.reach.state.online
      ? this.properties.rotation
      : engine.tool.quaternion.identity()
  },
  // Haptics
  getRumble: function (point) {
    return Math.max(
      Math.abs(point.x),
      Math.abs(point.y),
      Math.abs(point.z),
    ) ** 4
  },
})
