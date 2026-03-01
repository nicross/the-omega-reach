content.programs.cellar = content.programs.invent({
  id: 'cellar',
  fieldDefinitions: {
    flicker: {type: '1d'},
    terrain: {type: 'simplex3d', octaves: 3}
  },
  propertyDefinitions: {
    canMoveDown: () => content.rooms.cellar.canMoveDown(),
    canMoveLeft: () => content.rooms.cellar.canMoveLeft(),
    canMoveRight: () => content.rooms.cellar.canMoveRight(),
    canMoveUp: () => content.rooms.cellar.canMoveUp(),
    health: () => 1 - content.cellar.health.progress(),
    isEntrance: () => content.rooms.cellar.isEntrance(),
    position: () => content.cellar.position.get(),
  },
  onLoad: function () {
    setTimeout(() => this.loadProperties(), 0)
  },
  // Synthesis
  invertSynthX: function () {
    return !content.solution.has()
  },
  // Particles
  alterParticle: function (particle) {
    const hasSolution = content.solution.has(),
      isOnline = content.rooms.reach.state.online,
      time = content.time.value()

    let isBoundary = false

    particle.target.h = content.rooms.reach.state.online ? -25/360 : -1/3
    particle.target.s = 0
    particle.target.v = 1
    particle.target.x = particle.floor.x
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z

    if (
         (particle.target.y < -5 && !this.properties.canMoveLeft)
      || (particle.target.y > 5 && !this.properties.canMoveRight)
      || (particle.target.x < -5 && !this.properties.canMoveUp)
      || (particle.target.x < -5 && Math.abs(particle.target.y) > 5)
    ) {
      isBoundary = true
    }

    if (this.properties.isEntrance && particle.target.x < -5) {
      if (Math.abs(particle.target.y) < 5) {
        particle.target.z += Math.round(engine.fn.scale(particle.target.x, -7.5, -8.5, 0, 0.25) * 2) * 0.5
      } else {
        isBoundary = true
      }
    }

    if (isBoundary) {
      particle.target.h = isOnline ? (engine.fn.lerp(-25, 25, content.fn.gain(this.fields.flicker.valueAt({x: time}, 6), 1.5)) / 360) : engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, -1/2, -1/4)
      particle.target.s = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1]), -1, 1, 0.333, 1)
      particle.target.v = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[2]), -1, 1, 0, 1)

      particle.target.z += ((this.fields.terrain.valueAt({
        x: ((this.properties.position.x * 30) + particle.target.x) * 0.0625,
        y: ((this.properties.position.y * 30) + particle.target.y) * 0.0625,
        z: time * engine.fn.lerp(0, 1/4, this.properties.health),
      }, 1) ** 2) * 4 * this.properties.health) - 2
    }

    if (hasSolution) {
      const distance = Math.max(Math.abs(particle.target.x), Math.abs(particle.target.y))

      if (distance < 4) {
        particle.target.h = engine.fn.lerp(-25, 25, content.fn.gain(this.fields.flicker.valueAt({x: time}, 6), 1.5)) / 360
        particle.target.s = engine.fn.scale(Math.sin(engine.const.tau * time * particle.twinkleFrequencies[0]), -1, 1, 0.333, 1)

        particle.target.z = particle.floor.z + engine.fn.scale(
          Math.sin(engine.const.tau * time * particle.twinkleFrequencies[1] * 0.5),
          -1, 1,
          0, 4 - distance,
        )
      }
    }
  },
  // Rumble
  useNavigationalRumble: () => true,
})
