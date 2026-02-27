content.programs.gasGiant = content.programs.invent({
  id: 'gasGiant',
  fieldDefinitions: {
    color: {},
    saturation: {},
    value: {},
  },
  propertyDefinitions: {
    color1: (srand) => srand(-1/4, 1/4),
    color2: function (srand) {return this.properties.color1 + engine.fn.choose([
      () => 0.5 + srand(-5/360, 5/360),
      () => 1/3 + srand(-10/360, 10/360),
      () => 0 + srand(0/360, 45/360),
    ], srand())()},
    colorBands: (srand) => srand(6, 18),
    colorTimeScale: (srand) => srand(1/60, 1/15),
    ring: (srand) => Math.max(0, srand() - 0.5) * 2,
    saturationBands: (srand) => srand(6, 18),
    saturationCenter: (srand) => srand(0, 1),
    saturationRange: (srand) => srand(0, 1),
    saturationTimeScale: (srand) => srand(1/60, 1/15),
    valueBands: (srand) => srand(12, 24),
    valueCenter: (srand) => srand(7/8, 1),
    valueRange: (srand) => srand(0, 1/16),
    valueTimeScale: (srand) => srand(1/60, 1/15),
    zFactor: function () {return engine.fn.lerp(1, 0.875, this.options.body.mass)},
  },
  alterParticleColor: function (particle, point) {
    const time = content.time.value()

    particle.target.h = engine.fn.lerp(this.properties.color1, this.properties.color2, content.fn.gain(
      this.fields.color.valueAt({
        x: point.x * 0.25,
        y: point.z * this.properties.colorBands,
        z: time * this.properties.colorTimeScale,
      }, 1), 8
    ))

    particle.target.s = engine.fn.clamp(engine.fn.lerp(this.properties.saturationCenter - this.properties.saturationRange, this.properties.saturationCenter + this.properties.saturationRange,
      this.fields.saturation.valueAt({
        x: point.x * 0.25,
        y: point.z * this.properties.saturationBands,
        z: time * this.properties.saturationTimeScale,
      }, 1)
    ))

    particle.target.v = engine.fn.clamp(engine.fn.lerp(this.properties.valueCenter - this.properties.valueRange, this.properties.valueCenter + this.properties.valueRange,
      this.fields.value.valueAt({
        x: point.x * 0.25,
        y: point.z * this.properties.valueBands,
        z: time * this.properties.valueTimeScale,
      }, 1)
    ))

    if (this.properties.ring && Math.abs(point.z) < 0.025) {
      particle.target.s *= 0.125
      particle.target.v = 1
    }

    return true
  },
  alterParticleVertex: function (particle, point) {
    const radius = engine.fn.lerp(2, 3, this.options.body.radius)

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius * this.properties.zFactor

    if (this.properties.ring && Math.abs(point.z) < 0.025) {
      particle.target.x *= engine.fn.lerp(1.5, 2, this.properties.ring)
      particle.target.y *= engine.fn.lerp(1.5, 2, this.properties.ring)
      particle.target.z *= engine.fn.lerp(1.5, 2, this.properties.ring)
    }

    return true
  },
  // Rumble
  getRumble: function (point) {
    return content.fn.gain(this.fields.color.valueAt({
      x: point.x * 0.25,
      y: point.z * this.properties.colorBands,
      z: content.time.value() * this.properties.colorTimeScale,
    }, 1), 2)
  },
}, content.programs.basePlanet)
