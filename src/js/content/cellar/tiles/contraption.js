content.cellar.tiles.contraption = content.cellar.tiles.invent({
  id: 'contraption',
  name: 'The contraption',
  category: 'situational',
  uniquePerFloor: true,
  weight: 2,
  defaultState: {
    delta: 0,
  },
  onEnterEffects: function () {
    // Health trends toward zero or max, whichever is closest

    if (!content.cellar.health.has(2) || content.cellar.health.isMax()) {
      return
    }

    const health = content.cellar.health.amount(),
      midpoint = Math.floor(content.cellar.health.max() * 0.5)

    this.state.delta = 0

    if (health < midpoint) {
      this.state.delta = -1

      content.cellar.health.subtract(1)
      content.audio.sanityChange.trigger({isUp: false})

      this.effectsOnEnter.push({
        attribute: {
          label: `Sanity drained`,
          modifiers: [],
        },
      })
    } else if (health > midpoint) {
      this.state.delta = 1

      content.cellar.health.add(1)
      content.audio.sanityChange.trigger({isUp: true})

      this.effectsOnEnter.push({
        attribute: {
          label: `Sanity recovered`,
          modifiers: [],
        },
      })
    }
  },
  alterParticle: function (particle) {
    const radius = 7.5

    if (Math.abs(particle.target.x) > radius || Math.abs(particle.target.y) > radius) {
      return
    }

    const grid = 7,
      time = content.time.value()

    if (!this.zMatrixTimer || this.zMatrixTimer < time) {
      this.zMatrix = new Array(grid ** 2).fill().map(Math.random)
      this.zMatrixTimer = time + 2
    }

    const index = Math.floor(engine.fn.scale(particle.target.x, -radius, radius, 0, grid))
      + (grid * Math.floor(engine.fn.scale(particle.target.y, -radius, radius, 0, grid)))

    particle.target.s = content.fn.gain(1 - this.zMatrix[index], 2)
    particle.target.v = engine.fn.lerpExp(0.25, 1, this.zMatrix[index], 0.5)
    particle.target.z += engine.fn.lerp(-1, 0, Math.round(this.zMatrix[index] * grid) / grid)
  },
}, content.cellar.tiles.baseUnique)
