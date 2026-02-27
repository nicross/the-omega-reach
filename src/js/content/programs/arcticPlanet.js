content.programs.arcticPlanet = content.programs.invent({
  id: 'arcticPlanet',
  fieldDefinitions: {
    colorHue: {},
    colorSaturation: {},
    colorValue: {},
  },
  propertyDefinitions: {
    colorHueCenter: (srand) => srand(),
    colorHueRange: (srand) => srand(0, 0.5),
    colorHueScale: (srand) => srand(2, 6),
    colorSaturationCenter: (srand) => srand(0, 0.25),
    colorSaturationPower: (srand) => srand(0.125, 0.5),
    colorSaturationRange: (srand) => srand(0.25, 0.5),
    colorSaturationScale: (srand) => srand(2, 6),
    colorValueCenter: (srand) => srand(0.875, 1),
    colorValueRange: (srand) => srand(0, 0.25),
    colorValueScale: (srand) => srand(2, 6),
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
        this.fields.colorSaturation.valueAt(point, this.properties.colorSaturationScale) * (particle.value ** this.properties.colorSaturationPower)
      )
    )

    particle.target.v = engine.fn.clamp(
      engine.fn.lerp(
        this.properties.colorValueCenter - this.properties.colorValueRange,
        this.properties.colorValueCenter + this.properties.colorValueRange,
        this.fields.colorValue.valueAt(point, this.properties.colorValueScale)
      )
    )

    return true
  },
  alterParticleVertex: function (particle, point) {
    //return true
  },
}, content.programs.basePlanet)
