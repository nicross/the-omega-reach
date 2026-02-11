content.audio.calibration = (() => {
  const baseGain = engine.fn.fromDb(-4.5),
    bus = content.audio.channel.default.createBus()

  function trigger({
    duration = 1/6,
    pan = 0,
    velocity = 1,
  } = {}) {
    const frequency = engine.fn.lerp(500, 750, velocity),
      modDepth = engine.fn.fromDb(-6),
      modFrequency = engine.fn.lerp(15, 20, Math.random()),
      when = engine.time()

    // Synthesis
    const synth = engine.synth.amBuffer({
      buffer: content.audio.buffer.whiteNoise.choose(),
      carrierGain: 1,
      modDepth: 0,
      modFrequency,
    }).filtered({
      detune: engine.fn.randomFloat(-10, 10),
      frequency: frequency / 10,
    }).chainAssign(
      'panner', engine.context().createStereoPanner()
    ).connect(bus)

    synth.panner.pan.value = pan
    synth.panner.pan.linearRampToValueAtTime(-pan, when + duration)

    synth.param.mod.frequency.linearRampToValueAtTime(modFrequency/2, when + duration)

    synth.filter.frequency.exponentialRampToValueAtTime(frequency, when + duration)

    synth.param.gain.linearRampToValueAtTime(baseGain, when + 1/48)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

    synth.param.carrierGain.linearRampToValueAtTime(1 - modDepth, when + duration)
    synth.param.mod.depth.linearRampToValueAtTime(modDepth, when + duration)

    synth.stop(when + duration)
  }

  return {
    trigger: function (...args) {
      trigger(...args)

      return this
    },
  }
})()
