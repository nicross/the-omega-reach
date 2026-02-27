content.programs.acidPlanet = content.programs.invent({
  id: 'acidPlanet',
  fieldDefinitions: {
    color: {},
    saturation: {},
    value: {},
  },
  propertyDefinitions: {
    color1: (srand) => srand(1/6, 1/2),
    color2: function (srand) {return engine.fn.wrap(this.properties.color1 + engine.fn.choose([
      () => ((srand() > 0.5 ? 1 : -1) * 1/3) + srand(-10/360, 10/360),
      () => ((srand() > 0.5 ? 1 : -1) * 1/2) + srand(-10/360, 10/360),
    ], srand())(), -0.5, 0.5)},
    colorBands: (srand) => srand(3, 6),
    colorScale: (srand) => srand(1, 2),
    saturationBands: (srand) => srand(2, 6),
    saturationCenter: (srand) => srand(0.75, 1),
    saturationRange: (srand) => srand(0, 0.125),
    saturationScale: (srand) => srand(1, 2),
    valueBands: (srand) => srand(2, 6),
    valueCenter: (srand) => srand(7/8, 1),
    valueRange: (srand) => srand(0, 1/4),
    valueScale: (srand) => srand(2, 6),
  },
  alterParticleColor: function (particle, point) {
    const time = content.time.value()

    particle.target.h = engine.fn.lerp(this.properties.color1, this.properties.color2, content.fn.gain(
      this.fields.color.valueAt({
        x: point.x * 0.25,
        y: point.y * 0.25,
        z: point.z * this.properties.colorBands,
      }, this.properties.colorScale), 2)
    )

    particle.target.s = engine.fn.clamp(engine.fn.lerp(this.properties.saturationCenter - this.properties.saturationRange, this.properties.saturationCenter + this.properties.saturationRange,
      this.fields.saturation.valueAt({
        x: point.x * 0.25,
        y: point.y * 0.25,
        z: point.z * this.properties.saturationBands,
      }, this.properties.saturationScale)
    ))

    particle.target.v = engine.fn.clamp(engine.fn.lerp(this.properties.valueCenter - this.properties.valueRange, this.properties.valueCenter + this.properties.valueRange,
      this.fields.saturation.valueAt({
        x: point.x * 0.25,
        y: point.y * 0.25,
        z: point.z * this.properties.valueBands,
      }, this.properties.valueScale)
    ))

    return true
  },
  alterParticleVertex: function (particle, point) {
    const amplitude = 0.125 * this.bumpiness * 0.5

    const radius = engine.fn.lerp(1, 2, this.options.body.radius) * (1 + amplitude)

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    return true
  },
  // Rumble
  getRumble: function (point) {
    return content.fn.gain(this.fields.color.valueAt({
      x: point.x * 0.25,
      y: point.y * 0.25,
      z: point.z * this.properties.colorBands,
    }, this.properties.colorScale), 2)
  },
}, content.programs.basePlanet)
