content.audio.reach = (() => {
  const baseGain = engine.fn.fromDb(-9),
    bus = content.audio.channel.default.createBus()

  let muffle = 0,
    pan = 0,
    power = 0,
    stress = 0,
    synth,
    targetMuffle = 0,
    targetPan = 0,
    targetPower = 0,
    targetStress = 0

  function accelerate(isImmediate = false) {
    targetMuffle = content.location.get()?.getReachMuffle() || 0
    muffle = isImmediate ? targetMuffle : engine.fn.accelerateValue(muffle, targetMuffle, 4)

    targetPower = content.rooms.reach.state.online ? 1 : 0
    power = isImmediate ? targetPower : engine.fn.accelerateValue(power, targetPower, 1/4)

    targetPan = content.location.get()?.getReachPan() || 0
    pan = isImmediate ? targetPan : engine.fn.accelerateValue(pan, targetPan, 4)

    targetStress = engine.fn.accelerateValue(targetStress, 0, 2)
    stress = isImmediate ? targetStress : engine.fn.accelerateValue(stress, targetStress, 8)
  }

  function calculateParameters() {
    return {

    }
  }

  function createSynth() {
    const {
      test,
    } = calculateParameters()

    synth = true
  }

  function destroySynth() {
    synth = undefined
  }

  function updateSynth() {
    const {
      test,
    } = calculateParameters()

  }

  return {
    applyStress: function (value = 0, randomization = 1/4) {
      targetStress += value * engine.fn.randomFloat(1 - randomization, 1)
      targetStress = engine.fn.clamp(targetStress, -1, 1)

      return this
    },
    import: function () {
      if (synth) {
        return this
      }

      accelerate(true)

      if (power && !muffle) {
        createSynth()
      }

      return this
    },
    reset: function () {
      if (synth) {
        destroySynth()
      }

      muffle = 0
      pan = 0
      power = 0
      stress = 0
      targetMuffle = 0
      targetPan = 0
      targetPower = 0
      targetStress = 0

      return this
    },
    update: function () {
      accelerate()

      if (power && muffle != 1) {
        if (!synth) {
          createSynth()
        } else {
          updateSynth()
        }
      } else if (synth) {
        destroySynth()
      }

      return this
    },
  }
})()

engine.ready(() => {

  engine.loop.on('frame', ({paused}) => {
    if (paused) {
      return
    }

    content.audio.reach.update()
  })

  engine.state.on('import', () => content.audio.reach.import())
  engine.state.on('reset', () => content.audio.reach.reset())

  content.location.on('move', ({direction, from, to}) => {
    if (direction == 'up' && from.id == 'reach') {
      return
    }

    if (['horizon','galaxy','star','planet','moon'].includes(from.id)) {
      return content.audio.reach.applyStress({
        down: -1,
        left: -1/4,
        right: 1/4,
        up: 1,
      }[direction] || 0)
    }
  })

})
