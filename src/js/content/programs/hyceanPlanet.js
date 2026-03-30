content.programs.hyceanPlanet = content.programs.invent({
  id: 'hyceanPlanet',
  fieldDefinitions: {
    hue: {type: 'simplex4d'},
    saturation: {type: 'simplex4d'},
    value: {},
  },
  propertyDefinitions: {
    iceNorth: function (srand) {return (this.hasAttribute('Polar ice') && srand() > 1/2) || srand() > 1/2},
    iceNorthScale: (srand) => srand(1/16, 1/3),
    iceSouth: function (srand) {return (this.hasAttribute('Polar ice') && (!this.properties.iceNorth || srand() > 1/2)) || srand() > 1/2},
    iceSouthScale: (srand) => srand(1/16, 1/3),
    hueCenter: (srand) => srand(-180, -120) / 360,
    hueRange: (srand) => srand(0, 60) / 360,
    hueScale: (srand) => srand(2, 6),
    hueTimeScale: (srand) => srand(1/16, 1/8),
    saturationCenter: (srand) => srand(0.75, 1),
    saturationRange: (srand) => srand(0, 0.125),
    saturationScale: (srand) => srand(1, 2),
    saturationTimeScale: (srand) => srand(1/16, 1/8),
    valueCenter: (srand) => srand(7/8, 1),
    valueRange: (srand) => srand(0, 1/8),
    valueScale: (srand) => srand(2, 6),
    valueTimeScale: (srand) => srand(1/16, 1/8),
  },
  alterParticleColor: function (particle, point) {
    const depth = this.fields.radius.valueAt(point, this.properties.radiusScale) ** this.properties.radiusPower,
      time = content.time.value()

    particle.target.h = engine.fn.lerp(this.properties.hueCenter - this.properties.hueRange, this.properties.hueCenter + this.properties.hueRange,
      this.fields.hue.valueAt({
        time,
        x: point.x,
        y: point.y,
        z: point.z,
      }, this.properties.hueScale, this.properties.hueTimeScale)
    )

    const isIce = (this.properties.iceNorth && point.z > 1 - this.properties.iceNorthScale)
      || (this.properties.iceSouth && point.z < -1 + this.properties.iceSouthScale)

    if (isIce) {
      particle.target.s = 0
      particle.target.v = engine.fn.lerp(0.875, 1, depth)
    } else {
      particle.target.s = engine.fn.clamp(engine.fn.lerp(this.properties.saturationCenter - this.properties.saturationRange, this.properties.saturationCenter + this.properties.saturationRange,
        this.fields.saturation.valueAt({
          time,
          x: point.x,
          y: point.y,
          z: point.z,
        }, this.properties.saturationScale, this.properties.saturationTimeScale)
      ))

      particle.target.v = engine.fn.clamp(engine.fn.lerp(this.properties.valueCenter - this.properties.valueRange, this.properties.valueCenter + this.properties.valueRange,
        this.fields.saturation.valueAt({
          x: point.x,
          y: point.y,
          z: point.z,
        }, this.properties.valueScale, this.properties.valueTimeScale)
      )) * engine.fn.lerp(0.5, 1, depth)
    }

    return true
  },
  alterParticleVertex: function (particle, point) {
    const radius = engine.fn.lerp(1, 2, this.options.body.radius)

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    return true
  },
}, content.programs.basePlanet)
