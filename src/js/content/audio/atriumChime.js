content.audio.atriumChime = (() => {
  const baseGain = engine.fn.fromDb(-7.5),
    bus = content.audio.channel.default.createBus()

  function trigger({
    color,
    duration,
    frequency,
    when,
    width,
  } = {}) {
    // Synthesis
    const synth = engine.synth.pwm({
      detune: engine.fn.randomFloat(-10, 10),
      frequency,
      type: 'square',
      when,
      width,
    }).filtered({
      frequency: frequency * color,
    }).connect(bus)

    synth.param.gain.linearRampToValueAtTime(baseGain, when + 1/64)
    synth.param.gain.linearRampToValueAtTime(baseGain/16, when + 1/16)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

    synth.param.width.linearRampToValueAtTime(0.5, when + duration)

    synth.stop(when + duration)
  }

  return {
    trigger: function ({
      color = 4,
      delay = 1/16,
      duration = 1/2,
      notes = [],
      when = engine.time(),
    } = {}) {
      for (const i in notes) {
        trigger({
          color,
          duration,
          frequency: notes[i],
          when: when + delay + (i * delay),
          width: 0.5 + (engine.fn.randomSign() * engine.fn.randomFloat(0.125, 0.25)),
        })
      }

      return this
    },
  }
})()
