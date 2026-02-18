content.programs.terranPlanet = content.programs.invent({
  id: 'terranPlanet',
  fieldDefinitions: {
    ...content.programs.basePlanet.fieldDefinitions,
  },
  propertyDefinitions: {
    ...content.programs.basePlanet.propertyDefinitions,
  },
  alterParticleColor: function (particle, point) {
    //return true
  },
  alterParticleVertex: function (particle, point) {
    const amplitude = 0.25 * this.bumpiness

    const bump = amplitude
      * (this.fields.radius.valueAt(point, this.properties.radiusScale) ** this.properties.radiusPower)

    const radius = engine.fn.lerp(1, 2, this.options.body.radius)
      + Math.max(0, bump - (amplitude * 0.5))

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    return true
  },
}, content.programs.basePlanet)
