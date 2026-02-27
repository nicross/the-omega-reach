content.programs.baseGalaxy = content.programs.invent({
  id: 'baseGalaxy',
  fieldDefinitions: {
    irregularRadius: {},
  },
  propertyDefinitions: {
    // Particles
    galaxyRadius: function () {return engine.fn.lerp(3, 6, this.options.galaxy.mass)},
    irregularRadiusScale: (srand) => srand(1, 3),
    rotation: (srand) => engine.tool.quaternion.fromEuler({
      pitch: srand(-Math.PI, Math.PI),
      roll: srand(-Math.PI, Math.PI),
      yaw: srand(-Math.PI, Math.PI),
    }).normalize(),
    zScale: function (srand) {return {
      Elliptical: () => srand(3/4, 1),
      Irregular: () => srand(9/16, 13/16),
      Lenticular: () => srand(1/4, 3/4),
      Peculiar: () => srand(3/16, 7/16),
      Spiral: () => srand(1/32, 1/8),
    }[this.options.galaxy.type]()},
  },
  onLoad: function () {
    content.sphereIndex.randomize()
    return this
  },
  // Particles
  alterParticle: function (particle) {
    const age = this.options.galaxy.age,
      index = content.sphereIndex.get(),
      time = content.time.value(),
      zScale = this.properties.zScale

    const radius = this.options.galaxy.type == 'Irregular' || this.options.galaxy.type == 'Peculiar'
      ? engine.fn.lerp(this.properties.galaxyRadius * 0.25, this.properties.galaxyRadius * 1.75, this.fields.irregularRadius.valueAt(particle.spheres[index], this.properties.irregularRadiusScale))
      : this.properties.galaxyRadius

    const distance = engine.fn.distance({
      x: particle.spheres[index].x,
      y: particle.spheres[index].y,
    })

    particle.target.h = (engine.fn.lerp(0, 270, (1 - age) * engine.fn.lerp(1 - distance, 1, zScale)) + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]) * engine.fn.lerpExp(90, 30, age, 0.75))) / 360
    particle.target.s = engine.fn.lerp(distance, 1, zScale) * (engine.fn.lerpExp(0.5, 0.75, age, 0.5) + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]) * engine.fn.lerpExp(0.5, 0.25, age, 0.5)))
    particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)
    particle.target.x = particle.spheres[index].x * radius
    particle.target.y = particle.spheres[index].y * radius
    particle.target.z = particle.spheres[index].z * zScale * radius
  },
  getRotation: function () {
    return this.properties.rotation
  },
})
