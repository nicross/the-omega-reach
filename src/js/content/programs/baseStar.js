content.programs.baseStar = content.programs.invent({
  id: 'baseStar',
  fieldDefinitions: {
    radius4d: {type: 'simplex4d'},
  },
  propertyDefinitions: {
    rotation: (srand) => engine.tool.quaternion.fromEuler({
      pitch: srand(-Math.PI, Math.PI) * 0.25,
      roll: srand(-Math.PI, Math.PI) * 0.25,
      yaw: srand(-Math.PI, Math.PI) * 0.25
    }).normalize(),
    rotationRate: (srand) => srand(),
    rotationVelocity: (srand) => engine.tool.quaternion.fromEuler({pitch: srand(-Math.PI, Math.PI), roll: srand(-Math.PI, Math.PI), yaw: srand(-Math.PI, Math.PI)}).normalize(),
  },
  onLoad: function () {
    content.sphereIndex.randomize()
    return this
  },
  // Particles
  alterParticle: function (particle) {
    const index = content.sphereIndex.get(),
      isScanned = content.scans.is(this.options.star.name),
      time = content.time.value()

    if (!isScanned) {
      return this.alterParticleUnscanned(particle)
    }

    if (!this.alterParticleColor(particle, particle.spheres[index])) {
      particle.target.h = 0
      particle.target.s = 0
      particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, 0, 1)
    }

    if (!this.alterParticleVertex(particle, particle.spheres[index])) {
      const radius = engine.fn.lerp(2, 4, this.options.star.radius)
        + (0.5 * this.fields.radius4d.valueAt({
            time,
            x: particle.spheres[index].x,
            y: particle.spheres[index].y,
            z: particle.spheres[index].z,
          }, 2, 0.0125)
        )

      particle.target.x = particle.spheres[index].x * radius
      particle.target.y = particle.spheres[index].y * radius
      particle.target.z = particle.spheres[index].z * radius
    }
  },
  alterParticleColor: function (particle, point) {},
  alterParticleVertex: function (particle, point) {},
  getRotation: function () {
    const isScanned = content.scans.is(this.options.star.name)

    if (!isScanned) {
      return engine.tool.quaternion.identity()
    }

    this.properties.rotation = this.properties.rotation.multiply(
      this.properties.rotationVelocity.lerpFrom({}, engine.loop.delta() * this.getRotationRate())
    ).normalize()

    return this.properties.rotation
  },
  getRotationRate: function () {return 0.025 * this.properties.rotationRate},
})
