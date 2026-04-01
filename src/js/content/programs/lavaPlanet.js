content.programs.lavaPlanet = content.programs.invent({
  id: 'lavaPlanet',
  fieldDefinitions: {
    colorHue: {type: 'simplex4d'},
    colorSaturation: {},
    colorValue: {},
  },
  propertyDefinitions: {
    colorHueScale: (srand) => srand(1, 3),
    colorHuePower: (srand) => srand(1, 3),
    colorHueTimeScale: (srand) => engine.fn.lerp(1/20, 1/10, srand()),
    colorSaturationCenter: (srand) => srand(0.875, 1),
    colorSaturationRange: (srand) => srand(0, 0.125),
    colorSaturationScale: (srand) => srand(2, 4),
    colorValueCenter: function (srand) {return srand(0.875, 1)},
    colorValueRange: (srand) => srand(0, 0.125),
    colorValueScale: (srand) => srand(2, 6),
    radiusAlgorithm: (srand) => engine.fn.choose([
      (x) => x,
      (x) => content.fn.gain(x, 2),
      (x) => 1 - Math.abs(Math.cos(Math.PI * x)),
      (x) => 1 - Math.sin(Math.PI * x),
    ], srand()),
    radiusPower: (srand) => srand(0.75, 1.25),
    radiusScale: (srand) => srand(1, 5),
  },
  alterParticleColor: function (particle, point) {
    return true
  },
  alterParticleVertex: function (particle, point) {
    const amplitude = 0.125 * this.bumpiness

    const roll = this.properties.radiusAlgorithm(this.fields.radius.valueAt(point, this.properties.radiusScale)) ** this.properties.radiusPower
    const bump = engine.fn.clamp(engine.fn.scale(roll, 0.5, 1, 0, 1))
    const depth = engine.fn.clamp(engine.fn.scale(roll, 0, 0.5, 1, 0))

    const radius = engine.fn.lerp(1, 2, this.options.body.radius)
      * (1 + ((bump * 0.5) * amplitude))

    const isLava = depth > 0

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    particle.target.h = engine.fn.lerp(
      0/360, 75/360,
      this.fields.colorHue.valueAt({
        x: point.x, y: point.y, z: point.z, time: content.time.value(),
      }, this.properties.colorHueScale, this.properties.colorHueTimeScale) ** this.properties.colorHuePower,
    )

    particle.target.s = engine.fn.lerpExp(
      engine.fn.clamp(
        engine.fn.lerp(
          this.properties.colorSaturationCenter - this.properties.colorSaturationRange,
          this.properties.colorSaturationCenter + this.properties.colorSaturationRange,
          this.fields.colorSaturation.valueAt(point, this.properties.colorSaturationScale)
        )
      ),
      0,
      bump,
      0.5,
    )

    particle.target.v = engine.fn.lerpExp(
      engine.fn.clamp(
        engine.fn.lerp(
          this.properties.colorValueCenter - this.properties.colorValueRange,
          this.properties.colorValueCenter + this.properties.colorValueRange,
          content.fn.gain(this.fields.colorValue.valueAt(point, this.properties.colorValueScale), 2) * particle.value
        )
      ),
      0,
      bump,
      0.5,
    )

    return true
  },
}, content.programs.basePlanet)
