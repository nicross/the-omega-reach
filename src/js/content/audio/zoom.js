content.audio.zoom = (() => {
  const baseGain = engine.fn.fromDb(-12),
    bus = content.audio.channel.default.createBus(),
    rootFrequency = engine.fn.fromMidi(72)

  function trigger({
    duration = 1/4,
    pan = 0,
    isIn = true,
  } = {}) {
    const modDepth = engine.fn.fromDb(-3),
      modFrequency = engine.fn.lerp(15, 20, Math.random()),
      when = engine.time()

    // Synthesis
    const synth = engine.synth.am({
      carrierDetune: isIn ? -2400 : -1200,
      carrierFrequency: rootFrequency,
      carrierGain: 1,
      carrierType: 'triangle',
      modDepth: 0,
      modFrequency: isIn ? modFrequency/2 : modFrequency,
    }).shaped(
      engine.shape.noise2()
    ).filtered({
      detune: 0,
      frequency: rootFrequency,
    }).connect(bus)

    synth.param.mod.frequency.linearRampToValueAtTime(isIn ? modFrequency : modFrequency/2, when + duration)

    synth.filter.detune.linearRampToValueAtTime(1200, when + duration)
    synth.param.detune.linearRampToValueAtTime(isIn ? 0 : -3600, when + duration)

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
