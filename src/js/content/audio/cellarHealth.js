content.audio.cellarHealth = (() => {
  const baseGain = engine.fn.fromDb(-15),
    bus = content.audio.channel.default.createBus()

  let health = 0,
    synth

  function calculateParameters() {
    return {
      amDepth: engine.fn.fromDb(engine.fn.lerp(-9, -12, health)),
      amFrequency: engine.fn.lerpExp(4, 1, health, 0.5),
      cmDepth: engine.fn.lerpExp(1200, 600, health, 0.5),
      cmFrequency: 1/5 * engine.fn.lerpExp(5, 1, health, 0.5),
      filterFrequency: engine.fn.lerpExp(500, 100, health, 0.5),
      gain: engine.fn.fromDb(engine.fn.lerp(-6, 0, health)),
      pmDepth: engine.fn.lerpExp(0.75, 0.125, health, 0.5),
      pmFrequency: 1/13 * engine.fn.lerp(5, 1, health),
    }
  }

  function createSynth() {
    if (synth) {
      return
    }

    const context = engine.context()

    const {
      amDepth,
      amFrequency,
      cmDepth,
      cmFrequency,
      filterFrequency,
      gain,
      pmDepth,
      pmFrequency,
    } = calculateParameters()

    synth = engine.synth.buffer({
      buffer: content.audio.buffer.brownNoise.choose(),
      gain: gain - amDepth,
    }).filtered({
      frequency: filterFrequency,
    }).chainAssign(
      'panner', context.createStereoPanner()
    ).chainAssign(
      'fader', context.createGain()
    ).connect(bus)

    // Amplitude LFO
    synth.assign('am', engine.synth.lfo({
      depth: amDepth,
      frequency: amFrequency,
    }))

    synth.am.connect(synth.param.gain)
    synth.chainStop(synth.am)

    // Color LFO
    synth.assign('cm', engine.synth.lfo({
      depth: cmDepth,
      frequency: cmFrequency,
    }))

    synth.cm.connect(synth.filter.detune)
    synth.chainStop(synth.cm)

    // Pan LFO
    synth.assign('pm', engine.synth.lfo({
      depth: pmDepth,
      frequency: pmFrequency,
    }))

    synth.pm.connect(synth.panner.pan)
    synth.chainStop(synth.pm)

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
      amDepth,
      amFrequency,
      cmDepth,
      cmFrequency,
      filterFrequency,
      gain,
      pmDepth,
      pmFrequency,
    } = calculateParameters()

    engine.fn.setParam(synth.filter.frequency, filterFrequency)
    engine.fn.setParam(synth.param.am.depth, amDepth)
    engine.fn.setParam(synth.param.am.frequency, amFrequency)
    engine.fn.setParam(synth.param.cm.depth, cmDepth)
    engine.fn.setParam(synth.param.cm.frequency, cmFrequency)
    engine.fn.setParam(synth.param.gain, gain)
    engine.fn.setParam(synth.param.pm.depth, pmDepth)
    engine.fn.setParam(synth.param.pm.frequency, pmFrequency)
  }

  return {
    import: function () {
      health = content.cellar.health.progress()

      if (content.location.is('cellar')) {
        createSynth()
      }

      return this
    },
    reset: function () {
      if (synth) {
        destroySynth()
      }

      health = 0

      return this
    },
    update: function () {
      if (content.location.is('cellar')) {
        health = engine.fn.accelerateValue(health, content.cellar.health.progress(), 0.5)

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

    content.audio.cellarHealth.update()
  })

  engine.state.on('import', () => content.audio.cellarHealth.import())
  engine.state.on('reset', () => content.audio.cellarHealth.reset())
})
