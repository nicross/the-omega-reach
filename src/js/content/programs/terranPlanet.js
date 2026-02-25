content.programs.terranPlanet = content.programs.invent({
  id: 'terranPlanet',
  fieldDefinitions: {},
  propertyDefinitions: {
    iceNorth: (srand) => srand() > 1/3,
    iceNorthScale: (srand) => srand(1/16, 1/3),
    iceSouth: (srand) => srand() > 1/3,
    iceSouthScale: (srand) => srand(1/16, 1/3),
    radiusScale: (srand) => srand(1, 5),
  },
  alterParticleColor: function (particle, point) {
    return true
  },
  alterParticleVertex: function (particle, point) {
    const amplitude = 0.125 * this.bumpiness

    const roll = this.fields.radius.valueAt(point, this.properties.radiusScale)
    const bump = engine.fn.clamp(engine.fn.scale(roll, 0.5, 1, 0, 1)) ** this.properties.radiusPower
    const depth = engine.fn.clamp(engine.fn.scale(roll, 0, 0.5, 1, 0))

    const radius = engine.fn.lerp(1, 2, this.options.body.radius)
      * (1 + (bump * amplitude))

    const isIce = (this.properties.iceNorth && point.z > 1 - this.properties.iceNorthScale)
      || (this.properties.iceSouth && point.z < -1 + this.properties.iceSouthScale)

    particle.target.x = point.x * radius
    particle.target.y = point.y * radius
    particle.target.z = point.z * radius

    if (isIce) {
      particle.target.h = 0
      particle.target.s = 0
      particle.target.v = 1
    } else if (bump <= 0) {
      particle.target.h = -1/3
      particle.target.s = engine.fn.lerp(0.5, 1, depth)
      particle.target.v = engine.fn.lerp(1, 0.5, depth)
    } else if (bump < 0.0625) {
      particle.target.h = engine.fn.lerp(45, 90, particle.value) / 360
      particle.target.s = engine.fn.lerp(0.5, 1, particle.value)
      particle.target.v = 1
    } else if (bump < 0.25) {
      particle.target.h = engine.fn.lerp(120, 150, particle.value) / 360
      particle.target.s = 1
      particle.target.v = engine.fn.lerp(0.75, 1, particle.value)
    } else if (bump < 0.375) {
      particle.target.h = engine.fn.lerp(120, 150, particle.value) / 360
      particle.target.s = 1
      particle.target.v = engine.fn.lerp(0.25, 0.75, particle.value)
    } else if (bump < 0.5) {
      particle.target.h = 0
      particle.target.s = 0
      particle.target.v = engine.fn.lerp(0.25, 0.5, particle.value)
    } else {
      particle.target.h = 0
      particle.target.s = 0
      particle.target.v = 1
    }

    return true
  },
}, content.programs.basePlanet)
