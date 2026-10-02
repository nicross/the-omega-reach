content.audio.healthChange = (() => {
  const baseGain = engine.fn.fromDb(-12),
    bus = content.audio.channel.sfx.createBus(),
    rootFrequency = engine.fn.fromMidi(48)

  function trigger({
    duration = 1/2,
    isUp = true,
    when = engine.time() + engine.fn.randomFloat(1/6, 1/4),
  } = {}) {
    const detune = engine.fn.randomFloat(-10, 10) + (isUp ? 0 : 600),
      modFrequency = engine.fn.randomFloat(7, 13)

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
      detune,
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
    down: function (options = {}) {
      trigger({...options, isUp: false})

      return this
    },
    up: function (options = {}) {
      trigger({...options, isUp: true})

      return this
    },
  }
})()
