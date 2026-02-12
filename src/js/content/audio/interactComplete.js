content.audio.interactComplete = (() => {
  const baseGain = engine.fn.fromDb(-6),
    bus = content.audio.channel.default.createBus(),
    rootFrequency = engine.fn.fromMidi(48)

  function trigger({
    duration,
    when,
  } = {}) {
    // Synthesis
    const synth = engine.synth.pwm({
      detune: engine.fn.randomFloat(-10, 10),
      frequency: rootFrequency,
      type: 'sawtooth',
      when,
      width: engine.fn.randomFloat(0.333, 0.666),
    }).filtered({
      frequency: rootFrequency,
    }).connect(bus)

    synth.filter.detune.linearRampToValueAtTime(4800, when + duration)
    synth.param.detune.linearRampToValueAtTime(-2400, when + duration/4)

    synth.param.gain.linearRampToValueAtTime(baseGain, when + 1/64)
    synth.param.gain.linearRampToValueAtTime(baseGain/16, when + duration/4)
    synth.param.gain.linearRampToValueAtTime(0, when + duration)

    synth.stop(when + duration)
  }

  return {
    trigger: function ({
      duration = 1.5,
      when = engine.time(),
    } = {}) {
      trigger({
        duration,
        when,
      })

      return this
    },
  }
})()
