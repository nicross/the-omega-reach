content.programs.neutronStar = content.programs.invent({
  id: 'neutronStar',
  fieldDefinitions: {},
  propertyDefinitions: {
    radius4dLength: (srand) => srand(0.5, 1.5),
    radius4dScale: (srand) => srand(3, 6),
    radius4dTimeScale: (srand) => srand(0.25, 0.75),
  },
  alterParticleColor: function (particle, point) {
    const time = content.time.value()

    particle.target.h = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, -180, 180) / 360
    particle.target.s = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]), -1, 1, 0, 0.333)
    particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)

    return true
  },
  alterParticleVertex: function (particle, point) {
    const time = content.time.value()

    const radius = engine.fn.lerp(0.125, 0.25, this.options.star.radius) + engine.fn.lerpExp(0, this.properties.radius4dLength, this.fields.radius4d.valueAt({
      time,
      x: point.x,
      y: point.y,
      z: point.z,
    }, this.properties.radius4dScale, this.properties.radius4dTimeScale), 4)

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    return true
  },
  getRotationRate: function () {return engine.fn.lerp(0.25, 1, this.properties.rotationRate)},
}, content.programs.baseStar)
