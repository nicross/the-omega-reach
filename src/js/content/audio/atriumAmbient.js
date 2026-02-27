content.audio.atriumAmbient = (() => {
  const baseGain = engine.fn.fromDb(-18),
    bus = content.audio.channel.default.createBus(),
    fields = {}

  const fieldNames = [
    'brownModDepth',
    'brownModFrequency',
    'brownPlaybackRate',
    'pinkModDepth',
    'pinkModFrequency',
    'pinkPlaybackRate',
    'whiteModDepth',
    'whiteModFrequency',
    'whitePlaybackRate',
  ]

  let muffle = 0,
    pan = 0,
    synth,
    targetMuffle = 0,
    targetPan = 0,
    targetPower = 0,
    targetStress = 0

  content.audio.reverb().from(bus)

  for (const name of fieldNames) {
    fields[name] = engine.fn.createNoise({
      octaves: 2,
      seed: ['atrium', name],
      type: '1d',
    })

    engine.ephemera.add(fields[name])
  }

  function accelerate(isImmediate = false) {
    targetMuffle = (content.location.get()?.getAtriumMuffle() || 0)
    muffle = isImmediate ? targetMuffle : engine.fn.accelerateValue(muffle, targetMuffle, 4)

    targetPan = (content.location.get()?.getAtriumPan() || 0)
    pan = isImmediate ? targetPan : engine.fn.accelerateValue(pan, targetPan, 4)
  }

  function calculateParameters() {
    const modRate = engine.fn.lerp(1, 0.125, muffle),
      time = content.time.value()

    return {
      brownColor: engine.fn.lerp(1200, -1200, muffle),
      brownGain: engine.fn.fromDb(engine.fn.lerp(0, -6, muffle)),
      brownModDepth: engine.fn.fromDb(-12, -9, fields.brownModDepth.value(time / 8)),
      brownModFrequency: engine.fn.lerp(4, 16, fields.brownModFrequency.value(time / 8)) * modRate,
      brownPlaybackRate: engine.fn.lerp(0.125, 0.25, fields.brownPlaybackRate.value(time / 8)),
      pinkColor: engine.fn.lerp(1200, -1200, muffle),
      pinkGain: engine.fn.fromDb(engine.fn.lerp(-6, -12, muffle)),
      pinkModDepth: engine.fn.fromDb(-10.5, -7.5, fields.pinkModDepth.value(time / 6)),
      pinkModFrequency: engine.fn.lerp(4, 16, fields.pinkModFrequency.value(time / 6)) * modRate,
      pinkPlaybackRate: engine.fn.lerp(0.25, 0.5, fields.pinkPlaybackRate.value(time / 6)),
      whiteColor: engine.fn.lerp(-1200, 1200, muffle),
      whiteGain: engine.fn.fromDb(engine.fn.lerp(-21, -27, muffle)),
      whiteModDepth: engine.fn.fromDb(-9, -6, fields.pinkModDepth.value(time / 4)),
      whiteModFrequency: engine.fn.lerp(4, 16, fields.pinkModFrequency.value(time / 4)) * modRate,
      whitePlaybackRate: engine.fn.lerp(0.5, 1, fields.pinkPlaybackRate.value(time / 4)),
    }
  }

  function createSynth() {
    if (synth) {
      return
    }

    const context = engine.context()

    const {
      brownColor,
      brownGain,
      brownModDepth,
      brownModFrequency,
      brownPlaybackRate,
      pinkColor,
      pinkGain,
      pinkModDepth,
      pinkModFrequency,
      pinkPlaybackRate,
      whiteColor,
      whiteGain,
      whiteModDepth,
      whiteModFrequency,
      whitePlaybackRate,
    } = calculateParameters()

    synth = {
      panner: context.createStereoPanner(),
      output: context.createGain(),
    }

    synth.brown = engine.synth.amBuffer({
      buffer: content.audio.buffer.brownNoise.choose(),
      carrierGain: 1 - brownModDepth,
      gain: brownGain,
      modDepth: brownModDepth,
      modFrequency: brownModFrequency,
      playbackRate: brownPlaybackRate,
    }).filtered({
      detune: brownColor,
      frequency: 250,
    }).connect(synth.panner)

    synth.pink = engine.synth.amBuffer({
      buffer: content.audio.buffer.pinkNoise.choose(),
      carrierGain: 1 - pinkModDepth,
      gain: pinkGain,
      modDepth: pinkModDepth,
      modFrequency: pinkModFrequency,
      playbackRate: pinkPlaybackRate,
    }).filtered({
      detune: pinkColor,
      frequency: 500,
    }).connect(synth.panner)

    synth.white = engine.synth.amBuffer({
      buffer: content.audio.buffer.whiteNoise.choose(),
      carrierGain: 1 - whiteModDepth,
      gain: whiteGain,
      modDepth: whiteModDepth,
      modFrequency: whiteModFrequency,
      playbackRate: whitePlaybackRate,
    }).filtered({
      detune: whiteColor,
      frequency: 17500,
      type: 'highpass',
    }).connect(synth.panner)

    synth.panner.connect(synth.output)
    synth.output.connect(bus)

    // Fader
    const attack = 1/8
    synth.output.gain.value = 0
    engine.fn.rampLinear(synth.output.gain, baseGain, attack)
  }

  function destroySynth() {
    if (!synth) {
      return
    }

    const now = engine.time(),
      release = 1/8

    engine.fn.rampLinear(synth.output.gain, 0, release)

    synth.brown.stop(now + release)
    synth.pink.stop(now + release)
    synth.white.stop(now + release)

    synth = undefined
  }

  function updateSynth() {
    const {
      brownColor,
      brownGain,
      brownModDepth,
      brownModFrequency,
      brownPlaybackRate,
      pinkColor,
      pinkGain,
      pinkModDepth,
      pinkModFrequency,
      pinkPlaybackRate,
      whiteColor,
      whiteGain,
      whiteModDepth,
      whiteModFrequency,
      whitePlaybackRate,
    } = calculateParameters()

    engine.fn.setParam(synth.panner.pan, pan)

    engine.fn.setParam(synth.brown.filter.detune, brownColor)
    engine.fn.setParam(synth.brown.param.carrierGain, 1 - brownModDepth)
    engine.fn.setParam(synth.brown.param.gain, brownGain)
    engine.fn.setParam(synth.brown.param.mod.depth, brownModDepth)
    engine.fn.setParam(synth.brown.param.mod.frequency, brownModFrequency)
    engine.fn.setParam(synth.brown.param.playbackRate, brownPlaybackRate)

    engine.fn.setParam(synth.pink.filter.detune, pinkColor)
    engine.fn.setParam(synth.pink.param.carrierGain, 1 - pinkModDepth)
    engine.fn.setParam(synth.pink.param.gain, pinkGain)
    engine.fn.setParam(synth.pink.param.mod.depth, pinkModDepth)
    engine.fn.setParam(synth.pink.param.mod.frequency, pinkModFrequency)
    engine.fn.setParam(synth.pink.param.playbackRate, pinkPlaybackRate)

    engine.fn.setParam(synth.white.filter.detune, whiteColor)
    engine.fn.setParam(synth.white.param.carrierGain, 1 - whiteModDepth)
    engine.fn.setParam(synth.white.param.gain, whiteGain)
    engine.fn.setParam(synth.white.param.mod.depth, whiteModDepth)
    engine.fn.setParam(synth.white.param.mod.frequency, whiteModFrequency)
    engine.fn.setParam(synth.white.param.playbackRate, whitePlaybackRate)
  }

  function tweet({
    color = engine.fn.lerpExp(0.5, 2, Math.random() * (1 - muffle), 0.5),
    detune = engine.fn.randomFloat(-10, 10),
    duration = engine.fn.randomFloat(1/8, 1),
    frequency = engine.fn.fromMidi(engine.fn.choose([60,63,65,67,70,72], Math.random()) + 24),
    gain = engine.fn.fromDb(engine.fn.lerp(-39, -27, Math.random() * (1 - muffle))),
    pan2 = engine.fn.randomFloat(-1, 1) * (pan ? Math.abs(pan) : 1),
    when = engine.time(),
    width = engine.fn.randomFloat(0.25, 0.75),
  } = {}) {
    const synth = engine.synth.pwm({
      detune: -1200,
      frequency,
      type: 'triangle',
      when,
      width,
    }).chainAssign(
      'panner', engine.context().createStereoPanner()
    ).filtered({
      frequency: frequency * color,
    }).connect(bus)

    synth.panner.pan.value = engine.fn.clamp(pan + pan2, -1, 1)

    synth.param.gain.linearRampToValueAtTime(gain, when + 1/64)
    synth.param.gain.linearRampToValueAtTime(gain/4, when + 1/16)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

    synth.param.detune.linearRampToValueAtTime(detune, when + duration + 1/64)
    synth.param.detune.setValueAtTime(detune, when + duration/2)
    synth.param.detune.linearRampToValueAtTime(1200, when + duration)

    synth.param.width.linearRampToValueAtTime(0.5, when + duration)

    synth.stop(when + duration)
  }

  return {
    import: function () {
      if (synth) {
        return this
      }

      accelerate(true)

      if (!muffle) {
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
      targetMuffle = 0
      targetPan = 0

      return this
    },
    update: function () {
      accelerate()

      if (muffle != 1) {
        if (!synth) {
          createSynth()
        } else {
          updateSynth()
        }

        if (Math.random() < 2/engine.performance.fps()) {
          tweet()
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

    content.audio.atriumAmbient.update()
  })

  engine.state.on('import', () => content.audio.atriumAmbient.import())
  engine.state.on('reset', () => content.audio.atriumAmbient.reset())

})
