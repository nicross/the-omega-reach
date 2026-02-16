content.programs.whiteDwarf = content.programs.invent({
  id: 'whiteDwarf',
  fieldDefinitions: {
    ...content.programs.baseStar.fieldDefinitions,
  },
  propertyDefinitions: {
    ...content.programs.baseStar.propertyDefinitions,
    activity: (srand) => srand(),
  },
  alterParticleColor: function (particle, point) {
    const time = content.time.value()

    particle.target.h = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, 235, 335) / 360
    particle.target.s = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]), -1, 1, 0, 0.333)
    particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)

    return true
  },
  alterParticleVertex: function (particle, point) {
    const time = content.time.value()

    const radius = engine.fn.lerp(0.25, 0.75, this.options.star.radius) + engine.fn.lerp(0, 0.125, this.fields.radius4d.valueAt({
      time,
      x: point.x,
      y: point.y,
      z: point.z,
    }, 2, engine.fn.lerp(0.125, 0.5, this.properties.activity)))

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    return true
  },
}, content.programs.baseStar)
