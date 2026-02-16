content.programs.blackHole = content.programs.invent({
  id: 'blackHole',
  fieldDefinitions: {
    ...content.programs.baseStar.fieldDefinitions,
  },
  propertyDefinitions: {
    ...content.programs.baseStar.propertyDefinitions,
    radius: (srand) => srand(0, 0.5),
  },
  alterParticleColor: function (particle, point) {
    const time = content.time.value()

    particle.target.h = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, 0.75, 1) - 1
    particle.target.s = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]), -1, 1, 0, 1)

    return true
  },
  alterParticleVertex: function (particle, point) {
    const time = content.time.value()

    const radius4d = this.fields.radius4d.valueAt({
      time,
      x: point.x,
      y: point.y,
      z: point.z,
    }, 25, engine.fn.lerp(0.25, 0.5, this.properties.activity))

    const radius = engine.fn.lerp(0.125, 0.25, this.options.star.radius) + radius4d

    particle.target.v = radius4d ** 8
    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    return true
  },
}, content.programs.baseStar)
