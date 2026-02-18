content.programs.gasGiant = content.programs.invent({
  id: 'gasGiant',
  fieldDefinitions: {
    ...content.programs.basePlanet.fieldDefinitions,
  },
  propertyDefinitions: {
    ...content.programs.basePlanet.propertyDefinitions,
    zFactor: function () {return engine.fn.lerp(1, 0.875, this.options.body.mass)},
  },
  alterParticleColor: function (particle, point) {
    //return true
  },
  alterParticleVertex: function (particle, point) {
    const radius = engine.fn.lerp(2, 3, this.options.body.radius)

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius * this.properties.zFactor

    return true
  },
}, content.programs.basePlanet)
