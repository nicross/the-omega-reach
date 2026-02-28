content.programs.cellar = content.programs.invent({
  id: 'cellar',
  fieldDefinitions: {
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
  // Particles
  alterParticle: function (particle) {
    particle.target.h = 0
    particle.target.s = 0
    particle.target.v = 1
    particle.target.x = particle.floor.x
    particle.target.y = particle.floor.y
    particle.target.z = particle.floor.z

    if (
         (particle.target.y < -7.5 && !this.properties.canMoveLeft)
      || (particle.target.y > 7.5 && !this.properties.canMoveRight)
      || (particle.target.x < -7.5 && !this.properties.canMoveUp)
    ) {
      particle.target.v = 0.125
    }

    if (this.properties.isEntrance && particle.target.x < -7.5) {
      if (Math.abs(particle.target.y) < 7.5) {
        particle.target.z += engine.fn.scale(particle.target.x, -7.5, -8.5, 0, 0.25)
      } else {
        particle.target.v = 0.125
      }
    } else if (particle.target.v <= 0.125) {
      particle.target.z += (this.fields.terrain.valueAt({
        x: ((this.properties.position.x * 30) + particle.target.x) * 0.5,
        y: ((this.properties.position.y * 30) + particle.target.y) * 0.5,
        z: Math.sin(engine.const.tau * content.time.value() * engine.fn.lerp(0, 1/2, this.properties.health)),
      }, 1) ** 4) * 2 * this.properties.health
    }
  },
  // Rumble
  getRumble: function (point) {
    const vectors = [
      engine.tool.vector3d.unitZ(),
      engine.tool.vector3d.unitZ().inverse(),
    ]

    if (!this.properties.canMoveDown) {
      vectors.push(engine.tool.vector3d.unitX())
    }

    if (!this.properties.canMoveLeft) {
      vectors.push(engine.tool.vector3d.unitY().inverse())
    }

    if (!this.properties.canMoveRight) {
      vectors.push(engine.tool.vector3d.unitY())
    }

    if (!this.properties.canMoveUp) {
      vectors.push(engine.tool.vector3d.unitX().inverse())
    }

    const test = {
      x: Math.sign(point.x) * (Math.abs(point.x)) ** 2,
      y: Math.sign(point.y) * (Math.abs(point.y)) ** 2,
      z: Math.sign(point.z) * (Math.abs(point.z)) ** 2,
    }

    return vectors.reduce((value, vector) => {
      return Math.max(vector.dotProduct(test), value)
    }, 0)
  },
})
