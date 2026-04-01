content.programs.rockyPlanet = content.programs.invent({
  id: 'rockyPlanet',
  fieldDefinitions: {
    colorHue: {},
    colorSaturation: {},
    colorValue: {},
  },
  propertyDefinitions: {
    colorHueCenter: (srand) => srand(),
    colorHueRange: (srand) => srand(0, 0.5),
    colorHueScale: (srand) => srand(2, 6),
    colorSaturationCenter: (srand) => srand(0, 0.125),
    colorSaturationRange: (srand) => srand(0, 0.25),
    colorSaturationScale: (srand) => srand(2, 4),
    colorValueCenter: function (srand) {return srand(0.25, 0.5) + (this.hasAttribute('High albedo') ? 0.25 : 0)},
    colorValueRange: (srand) => srand(0, 0.333),
    colorValueScale: (srand) => srand(2, 6),
    radiusAlgorithm: (srand) => engine.fn.choose([
      (x) => x,
      (x) => content.fn.gain(x, 2),
      (x) => 1 - Math.abs(Math.cos(Math.PI * x)),
      (x) => 1 - Math.sin(Math.PI * x),
    ], srand()),
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
