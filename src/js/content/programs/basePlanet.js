content.programs.basePlanet = content.programs.invent({
  id: 'basePlanet',
  fieldDefinitions: {
    radius: {},
  },
  propertyDefinitions: {
    lightSource: (srand) => engine.tool.vector3d.create({
      x: srand(0, 1),
      y: srand(-1, 1),
      z: srand(-1, 1),
    }).normalize(),
    rotation: (srand) => engine.tool.quaternion.fromEuler({
      pitch: srand(-Math.PI, Math.PI),
      roll: srand(-Math.PI, Math.PI),
      yaw: srand(-Math.PI, Math.PI),
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
      isScanned = content.scans.is(this.options.body.name),
      time = content.time.value()

    if (!isScanned) {
      return this.alterParticleUnscanned(particle)
    }

    if (!this.alterParticleVertex(particle, particle.spheres[index])) {
      const radius = engine.fn.lerp(0.5, 1.5, this.options.body.radius)
        + (0.5 * this.fields.radius.valueAt(particle.spheres[index], 2))

      particle.target.x = particle.spheres[index].x * radius
      particle.target.y = particle.spheres[index].y * radius
      particle.target.z = particle.spheres[index].z * radius
    }

    if (!this.alterParticleColor(particle, particle.spheres[index])) {
      particle.target.h = 335/360
      particle.target.s = 1
      particle.target.v = 1
    }
  },
  alterParticleColor: function (particle, point) {},
  alterParticleVertex: function (particle, point) {},
  getLightSource: function () {
    return this.properties.lightSource.clone()
  },
  getRotation: function () {
    const isScanned = content.scans.is(this.options.body.name)

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
