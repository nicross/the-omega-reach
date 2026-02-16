content.programs.mainSequence = content.programs.invent({
  id: 'mainSequence',
  fieldDefinitions: {
    ...content.programs.baseStar.fieldDefinitions,
  },
  propertyDefinitions: {
    ...content.programs.baseStar.propertyDefinitions,
    radius: (srand) => srand(0, 0.5),
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

    const radius = engine.fn.lerp(1.5, 2.5, this.options.star.radius) + engine.fn.lerpExp(0, 0.5, this.fields.radius4d.valueAt({
      time,
      x: point.x,
      y: point.y,
      z: point.z,
    }, 3, engine.fn.lerp(0, 0.5, this.properties.activity)), 2)

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    return true
  },
}, content.programs.baseStar)
