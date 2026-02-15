content.particles = (() => {
  const limit = 5000,
    particles = []

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
    })
  }

  return {
    all: () => particles,
  }
})()
