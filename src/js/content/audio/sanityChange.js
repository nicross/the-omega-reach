content.audio.sanityChange = (() => {
  const baseGain = engine.fn.fromDb(-12),
    bus = content.audio.channel.default.createBus(),
    rootFrequency = engine.fn.fromMidi(48)

  function trigger({
    delay = 1/12,
    duration = 3/4,
    isUp = true,
  } = {}) {
    const detune = engine.fn.randomFloat(-10, 10) + (isUp ? 0 : 600),
      modFrequency = engine.fn.randomFloat(7, 13),
      when = engine.time() + delay

    // Synthesis
    const synth = engine.synth.fm({
      carrierDetune: detune,
      carrierFrequency: rootFrequency,
      carrierType: 'square',
      modDepth: engine.fn.randomFloat(0.5, 1) * rootFrequency,
      modFrequency: isUp ? engine.fn.randomFloat(4, 6) : engine.fn.randomFloat(14, 16),
      modType: 'sawtooth',
      when,
    }).filtered({
      frequency: rootFrequency * 2,
    }).connect(bus)

    synth.param.mod.frequency.exponentialRampToValueAtTime(isUp ? 15 : 5, when + duration)

    synth.param.detune.linearRampToValueAtTime(isUp ? 1800 : -1800, when + duration)

    synth.param.gain.linearRampToValueAtTime(baseGain, when + 1/48)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

    synth.param.mod.depth.linearRampToValueAtTime(0, when + duration)

    synth.stop(when + duration)
  }

  return {
    trigger: function (...args) {
      trigger(...args)

      return this
    },
  }
})()
