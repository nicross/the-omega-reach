content.particles = (() => {
  const maxParticles = 12500,
    minParticles = 2500,
    particles = []

  let limit = engine.fn.lerp(minParticles, maxParticles, 0.5)

  while (particles.length < limit) {
    particles.push({
      current: {
        h: 0,
        s: 0,
        v: 0,
        x: 0,
        y: 0,
        z: 0,
      },
      target: {
        h: 0,
        s: 0,
        v: 0,
        x: 0,
        y: 0,
        z: 0,
      },
      floor: engine.tool.vector3d.create({
        x: engine.fn.randomFloat(-40, 10),
        y: engine.fn.randomFloat(-30, 30),
        z: -2,
      }),
      spheres: [
        engine.tool.vector3d.create({
          x: engine.fn.randomFloat(-1, 1),
          y: engine.fn.randomFloat(-1, 1),
          z: engine.fn.randomFloat(-1, 1),
        }).normalize(),
        engine.tool.vector3d.create({
          x: engine.fn.randomFloat(-1, 1),
          y: engine.fn.randomFloat(-1, 1),
          z: engine.fn.randomFloat(-1, 1),
        }).normalize(),
        engine.tool.vector3d.create({
          x: engine.fn.randomFloat(-1, 1),
          y: engine.fn.randomFloat(-1, 1),
          z: engine.fn.randomFloat(-1, 1),
        }).normalize()
      ],
      twinkleFrequencies: [
        engine.fn.randomFloat(1/8, 1),
        engine.fn.randomFloat(1/8, 1),
        engine.fn.randomFloat(1/8, 1),
      ],
      value: Math.random(),
    })
  }

  return {
    all: () => particles.slice(0, limit),
    maxParticles: () => maxParticles,
    minParticles: () => minParticles,
    setLimit: function (value = 0.5) {
      limit = engine.fn.lerp(minParticles, maxParticles, value)

      return this
    },
  }
})()
