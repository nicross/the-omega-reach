content.programs.desertPlanet = content.programs.invent({
  id: 'desertPlanet',
  fieldDefinitions: {
    colorHue: {},
    colorSaturation: {},
    colorValue: {},
  },
  propertyDefinitions: {
    colorHueCenter: (srand) => srand(),
    colorHueScale: (srand) => srand(2, 6),
    colorSaturationScale: (srand) => srand(2, 6),
    colorValueScale: (srand) => srand(2, 6),
    iceNorth: function (srand) {return (this.hasAttribute('Polar ice') && srand() > 1/2) || srand() > 1/2},
    iceNorthScale: (srand) => srand(1/16, 1/3),
    iceSouth: function (srand) {return (this.hasAttribute('Polar ice') && (!this.properties.iceNorth || srand() > 1/2)) || srand() > 1/2},
    iceSouthScale: (srand) => srand(1/16, 1/3),
    radiusAlgorithm: (srand) => engine.fn.choose([
      (x) => x,
      (x) => content.fn.gain(x, 2),
      (x) => 1 - Math.abs(Math.cos(Math.PI * x)),
      (x) => 1 - Math.sin(Math.PI * x),
    ], srand()),
  },
  alterParticleColor: function (particle, point) {
    const isIce = (this.properties.iceNorth && point.z > 1 - this.properties.iceNorthScale)
      || (this.properties.iceSouth && point.z < -1 + this.properties.iceSouthScale)

    particle.target.h = (engine.fn.lerp(-15, 45, this.properties.colorHueCenter) + engine.fn.lerp(-15, 15, this.fields.colorHue.valueAt(point, this.properties.colorHueScale))) / 360

    if (isIce) {
      particle.target.s = 0
      particle.target.v = engine.fn.lerp(0.875, 1, this.fields.colorValue.valueAt(point, this.properties.colorValueScale * 2))
    } else {
      particle.target.s = engine.fn.lerp(0.75, 1, this.fields.colorSaturation.valueAt(point, this.properties.colorSaturationScale))
      particle.target.v = engine.fn.lerp(0.75, 1, this.fields.colorValue.valueAt(point, this.properties.colorValueScale) * particle.value)
    }

    return true
  },
  alterParticleVertex: function (particle, point) {
    //return true
  },
}, content.programs.basePlanet)
