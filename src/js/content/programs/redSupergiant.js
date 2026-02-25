content.programs.redSupergiant = content.programs.invent({
  id: 'redSupergiant',
  fieldDefinitions: {},
  propertyDefinitions: {
    radius4dAmplitude: (srand) => srand(0.5, 1),
    radius4dPower: (srand) => srand(0.5, 1.5),
    radius4dScale: (srand) => srand(4, 8),
    radius4dTimeScale: (srand) => engine.fn.lerp(1/8, 1/4, srand()),
  },
  alterParticleColor: function (particle, point) {
    const time = content.time.value()

    particle.target.h = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, engine.fn.lerp(-75, 0, this.options.star.mass), engine.fn.lerp(15, 90, this.options.star.mass)) / 360
    particle.target.s = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]), -1, 1, 0.875, 1)
    particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)

    return true
  },
  alterParticleVertex: function (particle, point) {
    const time = content.time.value()

    const radius = engine.fn.lerp(3, 4, this.options.star.radius) + engine.fn.lerpExp(0, this.properties.radius4dAmplitude, this.fields.radius4d.valueAt({
      time,
      x: point.x,
      y: point.y,
      z: point.z,
    }, this.properties.radius4dScale, this.properties.radius4dTimeScale), this.properties.radius4dPower)

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    return true
  },
  // Rumble
  getRumble: function (point) {
    return this.fields.radius4d.valueAt({
      time: content.time.value(),
      x: point.x,
      y: point.y,
      z: point.z,
    }, this.properties.radius4dScale, this.properties.radius4dTimeScale) ** this.properties.radius4dPower
  },
}, content.programs.baseStar)
