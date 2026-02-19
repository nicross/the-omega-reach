content.programs.iceGiant = content.programs.invent({
  id: 'iceGiant',
  fieldDefinitions: {
    ...content.programs.basePlanet.fieldDefinitions,
    color: {},
    saturation: {},
  },
  propertyDefinitions: {
    ...content.programs.basePlanet.propertyDefinitions,
    color1: (srand) => srand(1/3, 2/3),
    color2: function (srand) {return this.properties.color1 + srand(15/360, 45/360)},
    colorBands: (srand) => srand(6, 18),
    colorTimeScale: (srand) => srand(1/60, 1/15),
    saturationBands: (srand) => srand(6, 18),
    saturationCenter: (srand) => srand(0.5, 1),
    saturationRange: (srand) => srand(0, 0.5),
    saturationTimeScale: (srand) => srand(1/60, 1/15),
    zFactor: function () {return engine.fn.lerp(1, 0.875, this.options.body.mass)},
  },
  alterParticleColor: function (particle, point) {
    const time = content.time.value()

    particle.target.h = engine.fn.lerp(this.properties.color1, this.properties.color2, content.fn.gain(
      this.fields.color.valueAt({
        x: 0,
        y: point.z * this.properties.colorBands,
        z: time * this.properties.saturationTimeScale,
      }, 1), 2
    ))

    particle.target.s = engine.fn.clamp(engine.fn.lerp(this.properties.saturationCenter - this.properties.saturationRange, this.properties.saturationCenter + this.properties.saturationRange,
      this.fields.saturation.valueAt({
        x: 0,
        y: point.z * this.properties.saturationBands,
        z: time * this.properties.colorTimeScale,
      }, 1)
    ))

    particle.target.v = 1

    return true
  },
  alterParticleVertex: function (particle, point) {
    const radius = engine.fn.lerp(2, 3, this.options.body.radius)

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius * this.properties.zFactor

    return true
  },
}, content.programs.basePlanet)
