content.programs.basePlanet = content.programs.invent({
  id: 'basePlanet',
  bumpiness: 1,
  fieldDefinitions: {
    radius: {octaves: 2},
  },
  propertyDefinitions: {
    lightSource: (srand) => engine.tool.vector3d.create({
      x: srand(0, 1),
      y: srand(-1, 1),
      z: srand(-1, 1),
    }).normalize(),
    radiusAlgorithm: (srand) => (x) => x,
    radiusPower: (srand) => srand(1, 2),
    radiusScale: (srand) => srand(1, 4),
    ring: function (srand) {return this.hasAttribute('Ring system') ? srand() : 0},
    rotation: function (srand) {
      const tiltFactor  = this.hasAttribute('Extreme tilt') ? 1 : 16

      return this.properties.lightSource.quaternion().conjugate().multiply(
        engine.tool.quaternion.fromEuler({
          pitch: srand(-1, 1) * engine.const.tau / tiltFactor,
          roll: srand(-1, 1) * engine.const.tau / tiltFactor,
          yaw: srand(-1, 1) * engine.const.tau / tiltFactor,
        })
      )
    },
    rotationRate: function (srand) {return this.hasAttribute('Tidally locked') ? 0 : srand()},
    rotationVelocity: function (srand) {
      return engine.tool.quaternion.fromEuler({yaw: this.hasAttribute('Retrograde spin') ? -1 : 1}).normalize()
    },
  },
  onLoad: function () {
    content.sphereIndex.randomize()
    return this
  },
  onUpdate: function () {
    this.properties.rotation = this.properties.rotation.multiply(
      this.properties.rotationVelocity.lerpFrom({}, engine.loop.delta() * this.getRotationRate())
    ).normalize()
  },
  // Particles
  alterParticle: function (particle) {
    const index = content.sphereIndex.get(),
      isScanned = content.scans.is(this.options.body.name),
      time = content.time.value()

    if (!isScanned) {
      return this.alterParticleUnscanned(particle, 1)
    }

    if (!this.alterParticleVertex(particle, particle.spheres[index])) {
      const radius = engine.fn.lerp(1, 2, this.options.body.radius)
        * (1 + (0.125 * this.bumpiness * this.properties.radiusAlgorithm(this.fields.radius.valueAt(particle.spheres[index], this.properties.radiusScale) ** this.properties.radiusPower)))

      particle.target.x = particle.spheres[index].x * radius
      particle.target.y = particle.spheres[index].y * radius
      particle.target.z = particle.spheres[index].z * radius
    }

    if (!this.alterParticleColor(particle, particle.spheres[index])) {
      particle.target.h = -25/360
      particle.target.s = 1
      particle.target.v = 1
    }

    if (this.properties.ring && Math.abs(particle.spheres[index].z) < 0.025) {
      particle.target.s *= 0.125
      particle.target.v = engine.fn.lerp(0.875, 1, particle.target.v)
      particle.target.x *= engine.fn.lerp(1.5, 2, this.properties.ring)
      particle.target.y *= engine.fn.lerp(1.5, 2, this.properties.ring)
      particle.target.z *= engine.fn.lerp(1.5, 2, this.properties.ring)
    }
  },
  alterParticleColor: function (particle, point) {},
  alterParticleVertex: function (particle, point) {},
  getLightSource: function () {
    return this.properties.lightSource.clone()
  },
  getRotation: function () {
    return content.scans.is(this.options.body.name)
      ? this.properties.rotation
      : engine.tool.quaternion.identity()
  },
  hasAttribute: function (name) {
    for (const quirk of this.options.body.quirks) {
      if (quirk.name == name) {
        return true
      }
    }

    return false
  },
  getRotationRate: function () {return 0.1 * this.properties.rotationRate},
  // Rumble
  getRumble: function (point) {
    return this.fields.radius.valueAt(point, this.properties.radiusScale) ** this.properties.radiusPower
  },
})
