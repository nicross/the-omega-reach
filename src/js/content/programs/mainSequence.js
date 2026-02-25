content.programs.mainSequence = content.programs.invent({
  id: 'mainSequence',
  fieldDefinitions: {},
  propertyDefinitions: {
    radius4dAmplitude: (srand) => srand(0.5, 1),
    radius4dPower: (srand) => srand(1, 3),
    radius4dScale: (srand) => srand(3, 6),
    radius4dTimeScale: (srand) => engine.fn.lerp(1/32, 1/16, srand()),
  },
  alterParticleColor: function (particle, point) {
    const time = content.time.value()

    particle.target.h = (engine.fn.lerp(45, 0, this.options.star.age * (1 - this.options.star.mass)) + (Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]) * 30)) / 360
    particle.target.s = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]), -1, 1, this.options.star.age, 1)
    particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)

    return true
  },
  alterParticleVertex: function (particle, point) {
    const time = content.time.value()

    const radius = engine.fn.lerp(2, 3, this.options.star.radius) + engine.fn.lerpExp(0, this.properties.radius4dAmplitude, this.fields.radius4d.valueAt({
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
  getRumble: function () {
    return this.fields.radius4d.valueAt({
      time: content.time.value(),
      x: point.x,
      y: point.y,
      z: point.z,
    }, this.properties.radius4dScale, this.properties.radius4dTimeScale) ** this.properties.radius4dPower
  },
}, content.programs.baseStar)
