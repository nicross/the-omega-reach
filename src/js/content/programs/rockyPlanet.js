content.programs.rockyPlanet = content.programs.invent({
  id: 'rockyPlanet',
  fieldDefinitions: {
    ...content.programs.basePlanet.fieldDefinitions,
    colorHue: {},
    colorSaturation: {},
    colorValue: {},
  },
  propertyDefinitions: {
    ...content.programs.basePlanet.propertyDefinitions,
    colorHueCenter: (srand) => srand(),
    colorHueRange: (srand) => srand(0, 0.5),
    colorHueScale: (srand) => srand(1, 4),
    colorSaturationCenter: (srand) => srand(0.125, 0.375),
    colorSaturationRange: (srand) => srand(0, 0.25),
    colorSaturationScale: (srand) => srand(2, 4),
    colorValueCenter: (srand) => srand(0.333, 0.666),
    colorValueRange: (srand) => srand(0, 0.333),
    colorValueScale: (srand) => srand(1, 4),
  },
  alterParticleColor: function (particle, point) {
    particle.target.h = engine.fn.lerp(
      this.properties.colorHueCenter - this.properties.colorHueRange,
      this.properties.colorHueCenter + this.properties.colorHueRange,
      this.fields.colorHue.valueAt(point, this.properties.colorHueScale)
    )

    particle.target.s = engine.fn.clamp(
      engine.fn.lerp(
        this.properties.colorSaturationCenter - this.properties.colorSaturationRange,
        this.properties.colorSaturationCenter + this.properties.colorSaturationRange,
        this.fields.colorSaturation.valueAt(point, this.properties.colorSaturationScale)
      )
    )

    particle.target.v = engine.fn.clamp(
      engine.fn.lerp(
        this.properties.colorValueCenter - this.properties.colorValueRange,
        this.properties.colorValueCenter + this.properties.colorValueRange,
        content.fn.gain(this.fields.colorValue.valueAt(point, this.properties.colorValueScale), 2) * particle.value
      )
    )

    return true
  },
  alterParticleVertex: function (particle, point) {
    //return true
  },
}, content.programs.basePlanet)
