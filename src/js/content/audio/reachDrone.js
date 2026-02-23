content.audio.reachDrone = (() => {
  const baseGain = engine.fn.fromDb(-12),
    bus = content.audio.channel.default.createBus(),
    rootFrequency = engine.fn.fromMidi(24)

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
    const isTitle = Boolean(engine.loop.isPaused() && !content.location.get())
    isImmediate = isImmediate && !isTitle

    targetMuffle = isTitle ? 0.125 : (content.location.get()?.getReachMuffle() || 0)
    muffle = isImmediate ? targetMuffle : engine.fn.accelerateValue(muffle, targetMuffle, 4)

    targetPower = isTitle ? 1 : (content.rooms.reach.state.online ? 1 : 0)
    power = isImmediate ? targetPower : engine.fn.accelerateValue(power, targetPower, isTitle ? 1/4 : 1/2)

    targetPan = isTitle ? 0 : (content.location.get()?.getReachPan() || 0)
    pan = isImmediate ? targetPan : engine.fn.accelerateValue(pan, targetPan, 4)

    targetStress = isTitle ? 0 : engine.fn.accelerateValue(targetStress, 0, 2)
    stress = isImmediate ? targetStress : engine.fn.accelerateValue(stress, targetStress, 16)
  }

  function calculateParameters() {
    return {
      carrierDetune: engine.fn.lerp(-1200, 0, power) + engine.fn.lerp(0, 2400, Math.abs(stress)),
      carrierGain: (power ** 0.75) * engine.fn.fromDb(engine.fn.lerp(0, -3, engine.fn.lerp(muffle, 0, stress))),
      color: engine.fn.lerp(3, 1, engine.fn.lerp(muffle, 0, stress)),
    }
  }

  function createSynth() {
    if (synth) {
      return
    }

    const context = engine.context()

    const {
      carrierDetune,
      carrierGain,
      color,
    } = calculateParameters()

    synth = engine.synth.pwm({
      detune: carrierDetune,
      frequency: rootFrequency,
      gain: carrierGain,
      type: 'triangle',
      width: 0.5,
    }).filtered({
      detune: color * 1200,
      frequency: rootFrequency,
    }).chainAssign(
      'panner', context.createStereoPanner()
    ).chainAssign(
      'fader', context.createGain()
    ).connect(bus)

    synth.panner.pan.value = pan
    content.audio.reverb().from(synth)

    // Color LFO
    synth.assign('cm', engine.synth.lfo({
      depth: 600,
      frequency: 1/29,
    }))

    synth.cm.connect(synth.filter.detune)
    synth.chainStop(synth.cm)

    // Width LFO
    synth.assign('wm', engine.synth.lfo({
      depth: 0.1666,
      frequency: 1/59,
    }))

    synth.wm.connect(synth.param.width)
    synth.chainStop(synth.wm)

    // Fader
    const attack = 1/8
    synth.fader.gain.value = 0
    engine.fn.rampLinear(synth.fader.gain, baseGain, attack)
  }

  function destroySynth() {
    if (!synth) {
      return
    }

    const now = engine.time(),
      release = 1/8

    engine.fn.rampLinear(synth.fader.gain, 0, release)
    synth.stop(now + release)

    synth = undefined
  }

  function updateSynth() {
    const {
      carrierDetune,
      carrierGain,
      color,
    } = calculateParameters()

    engine.fn.setParam(synth.filter.detune, color * 1200)
    engine.fn.setParam(synth.panner.pan, pan)
    engine.fn.setParam(synth.param.detune, carrierDetune)
    engine.fn.setParam(synth.param.gain, carrierGain)
  }

  return {
    applyStress: function (value = 0, randomization = 1/4) {
      targetStress += value * engine.fn.randomFloat(1 - randomization, 1 + randomization)
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

  engine.loop.on('frame', () => {
    content.audio.reachDrone.update()
  })

  engine.state.on('import', () => content.audio.reachDrone.import())
  engine.state.on('reset', () => content.audio.reachDrone.reset())

  content.location.on('move', ({direction, from, to}) => {
    if (direction == 'up' && from.id == 'reach') {
      return content.audio.reachDrone.applyStress(1)
    }

    if (['horizon','galaxy','star','planet','moon'].includes(from.id)) {
      return content.audio.reachDrone.applyStress({
        down: -1,
        left: 1/2,
        right: 1/2,
        up: 1,
      }[direction] || 0)
    }
  })

})
