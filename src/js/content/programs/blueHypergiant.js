content.programs.blueHypergiant = content.programs.invent({
  id: 'blueHypergiant',
  fieldDefinitions: {
    ...content.programs.baseStar.fieldDefinitions,
  },
  propertyDefinitions: {
    ...content.programs.baseStar.propertyDefinitions,
    radius4dScale: (srand) => srand(2, 6),
    radius4dTimeScale: (srand) => engine.fn.lerp(1/60, 1/15, srand()),
  },
  alterParticleColor: function (particle, point) {
    const time = content.time.value()

    particle.target.h = (engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, engine.fn.lerp(180, 270, this.options.star.mass), engine.fn.lerp(225, 315, this.options.star.mass)) / 360) - 1
    particle.target.s = (engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]), -1, 1, 0, 1) ** 0.5) * engine.fn.lerp(0.5, 1, this.options.star.radius)
    particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)

    return true
  },
  alterParticleVertex: function (particle, point) {
    const time = content.time.value()

    const radius = engine.fn.lerp(3, 4.5, this.options.star.radius) + engine.fn.lerp(-0.5, 0.5, this.fields.radius4d.valueAt({
      time,
      x: point.x,
      y: point.y,
      z: point.z,
    }, this.properties.radius4dScale, this.properties.radius4dTimeScale))

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    return true
  },
}, content.programs.baseStar)
