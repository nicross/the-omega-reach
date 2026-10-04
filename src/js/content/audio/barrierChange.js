content.audio.barrierChange = (() => {
  const baseGain = engine.fn.fromDb(-12),
    bus = content.audio.channel.sfx.createBus(),
    rootFrequency = engine.fn.fromMidi(60)

  function trigger({
    duration = 1/2,
    isUp = true,
    when = engine.time() + engine.fn.randomFloat(1/6, 1/4),
  } = {}) {
    const detune = engine.fn.randomFloat(-10, 10),
      modFrequency = engine.fn.randomFloat(7, 13)

    // Synthesis
    const synth = engine.synth.fm({
      carrierDetune: detune,
      carrierFrequency: rootFrequency,
      carrierType: 'square',
      modDepth: isUp ? 0 : engine.fn.randomFloat(0.25, 0.5) * rootFrequency,
      modFrequency: 5,
      modType: 'triangle',
      when,
    }).filtered({
      detune,
      frequency: rootFrequency * 2,
    }).connect(bus)

    synth.param.mod.frequency.exponentialRampToValueAtTime(15, when + duration)

    synth.param.detune.linearRampToValueAtTime(detune + (isUp ? -1200 : 600), when + duration/8)
    synth.param.detune.linearRampToValueAtTime(detune + (isUp ? 1200 : -1800), when + duration/4)

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
    trigger: function (options = {}) {
      trigger(options)

      return this
    },
    up: function (options = {}) {
      trigger({...options, isUp: true})

      return this
    },
  }
})()
