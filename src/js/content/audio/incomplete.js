content.audio.incomplete = (() => {
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
      type: 'triangle',
      when,
      width,
    }).filtered({
      frequency: frequency * color,
    }).connect(bus)

    synth.param.gain.linearRampToValueAtTime(baseGain, when + 1/64)
    synth.param.gain.linearRampToValueAtTime(baseGain/4, when + 1/32)
    synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

    synth.param.width.linearRampToValueAtTime(0.5, when + duration)

    synth.stop(when + duration)
  }

  return {
    trigger: function ({
      delay = 1/16,
      duration = 1/8,
      when = engine.time(),
    } = {}) {
      const notes = [67,84,79].map(engine.fn.fromMidi)

      for (const i in notes) {
        trigger({
          color: i == notes.length - 1 ? 0.5 : 0.25,
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
